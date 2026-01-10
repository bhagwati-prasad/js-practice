Architectural Specification: Offline-First Hierarchical Note-Taking System Using IndexedDB

1. Introduction to Local-First ArchitectureThe evolution of web application architecture has witnessed a pendulum swing from the thin-client models of the early internet to the rich, cloud-centric implementations of the SaaS era, and now, toward a "Local-First" paradigm. In this modern context, the user's device is not merely a rendering terminal but the primary source of truth for data.1 This architectural shift is particularly critical for note-taking applications, where users demand zero-latency interaction, absolute availability regardless of network conditions, and data ownership.Designing a system to meet these demands requires a rigorous utilization of IndexedDB, the browser-native NoSQL storage system. Unlike its predecessor localStorage, which is synchronous and limited to mere megabytes of string data, IndexedDB offers an asynchronous, transactional, and scalable environment capable of storing gigabytes of structured objects.2 However, IndexedDB operates fundamentally as a Key-Value (KV) store utilizing B-tree indexing, a distinct departure from the relational models (RDBMS) that developers typically rely on for complex data modeling.2The specific challenge addressed in this report is the design of a schema for a block-based note-taking application comprising four distinct entities: Collections (recursive directories), Notebooks (containers), Notes (documents), and Cells (atomic content blocks). This hierarchical and ordered data model presents specific algorithmic challenges in a NoSQL environment—namely, the efficient retrieval of recursive trees, the management of ordered lists without write amplification, and the preservation of data integrity during offline synchronization.5This comprehensive analysis synthesizes architectural patterns from industry leaders such as Notion and AppFlowy, combining them with deep performance characteristics of browser storage engines (LevelDB/SQLite implementations of IndexedDB).7 It proposes a hybridized schema utilizing Materialized Paths for hierarchy traversal, Fractional Indexing for conflict-free ordering, and Granular Block Storage to facilitate Conflict-Free Replicated Data Type (CRDT) compatibility.9

2. Core Storage Technologies and ConstraintsTo design an effective schema, one must first understand the substrate upon which the application rests. IndexedDB is a low-level API that provides a transactional database system.

2.1 The Transactional Model and ConcurrencyIndexedDB supports transactions, which are essential for maintaining data consistency across related entities—for instance, ensuring that when a Note is deleted, its constituent Cells are also removed or marked for deletion.2 These transactions are atomic; if any part of the operation fails, the entire transaction rolls back, preventing the database from entering an invalid state.However, the asynchronous nature of IndexedDB introduces complexity. Operations do not block the main thread, which is beneficial for UI responsiveness but necessitates careful management of the event loop. Research indicates that excessive "ping-ponging" between the JavaScript main thread and the database thread (as seen when iterating with cursors) can degrade performance significantly.11 Consequently, the schema design must prioritize bulk operations (getAll, put in batches) over iterative singular operations to minimize Inter-Process Communication (IPC) overhead.

2.2 Storage Limits and Eviction PoliciesWhile often touted as allowing "large-scale" storage, IndexedDB limits are browser-dependent. Chrome typically allows an origin to use up to 60-80% of available disk space, while Safari and Firefox have historically been more conservative or prompted user permission earlier.12A critical consideration for a note-taking app is the storage of binary assets (images, attachments). While IndexedDB can store Blob objects, performance benchmarks suggest that storing large binary blobs inline with JSON data can degrade the performance of query operations, as the serialization and deserialization of large objects block the main thread during the structured clone algorithm.13 Therefore, the architectural recommendation is to store metadata and small text content within the primary cells store, while offloading large media to a dedicated object store or the Cache API, referenced by UUIDs.

3. Entity Analysis: The Recursive CollectionThe requirement for a "Collection" entity that supports infinite recursion (folders inside folders) poses the single most significant challenge in a Key-Value store environment.

3.1 The Hierarchy Problem in NoSQLIn a relational database, recursive hierarchies are often managed using Adjacency Lists (a parent_id column) and queried using recursive Common Table Expressions (CTEs). IndexedDB lacks CTEs. Retrieving a deep folder structure using a simple Adjacency List would require the application to fetch the root, wait for the promise to resolve, fetch the children, wait again, and so on—a "waterfall" of network requests that results in imperceptible UI lag.2Three primary models exist for handling hierarchy in non-relational databases:StrategyMechanismRead Complexity (Subtree)Write Complexity (Move Node)Suitability for IndexedDBAdjacency ListStore parent_id only.$O(N)$ recursive queries$O(1)$ single updateLow (Poor read performance)Nested SetsStore left & right bounds.$O(1)$ range query$O(N/2)$ massive updatesLow (Fragile sync/concurrency)Materialized PathStore full path string.$O(1)$ prefix query$O(S)$ where S is subtree sizeHigh (Best balance)

3.2 The Materialized Path SolutionThe analysis strongly favors the Materialized Path pattern for this use case.4 In this model, every Collection record stores a string representation of its ancestry.For example, a folder structure Root > Work > Projects would be represented as:Root: ID: A, Path: /Work: ID: B, Path: /A/Projects: ID: C, Path: /A/B/To retrieve all folders inside "Work" (including "Projects" and any deeper levels), the application opens a cursor on the path index with a key range starting at /A/B/. This allows fetching the entire subtree in a single database request, significantly optimizing the "initial load" performance of the application.16

3.3 Schema Definition: collectionsThe following schema definition incorporates the Materialized Path strategy along with necessary metadata for synchronization and UI rendering.Field NameData TypeIndexing StrategyDescription and RationaleidUUID (String)Key PathA version 4 UUID is essential for offline creation. Auto-incrementing integers cannot be used as they would collide when multiple devices create items offline.9parent_idUUID | nullIndexedStores the immediate parent. Essential for rapid "move" operations where the UI needs to know the immediate container, and for validating referential integrity.2pathStringIndexedThe Materialized Path (e.g., /uuid-root/uuid-parent/). Used for subtree queries. The index allows startsWith querying via IDBKeyRange.bound.15nameStringThe user-facing display name.created_atNumberUTC Timestamp (milliseconds).updated_atNumberIndexedCritical for synchronization (LWW resolution). Indexed to allow finding recently modified items.19is_deletedBooleanTombstone flag. Soft deletion is mandatory to propagate deletes to the server during sync.20is_dirtyBooleanIndexedFlag indicating local changes pending sync. Allows the sync worker to quickly identify records to push.21Algorithmic Implication for "Move" Operations:When a user drags Folder C (ID: C) from Parent B to Parent X, the application must:Update C: Set parent_id = X, path = /X/.Query all descendants of C (using the old path /A/B/C/).Iterate through descendants and replace the prefix /A/B/C/ with /X/C/ in their path field.Commit all changes in a single readwrite transaction.While this results in higher write amplification than an Adjacency List, the frequency of folder moves is negligible compared to the frequency of reads (rendering the sidebar), justifying the trade-off.15

4. Entity Analysis: NotebooksThe Notebook entity serves as a logical grouping mechanism, sitting primarily within Collections but potentially at the root level. It acts as the "binder" for individual notes.

4.1 Relationship ModelingThe Notebook has a Many-to-One relationship with Collections and a One-to-Many relationship with Notes. In relational terms, this is a Foreign Key on the Notebook pointing to the Collection, and a Foreign Key on the Note pointing to the Notebook.

4.2 Schema Definition: notebooksField NameData TypeIndexing StrategyDescription and RationaleidUUID (String)Key PathUnique Identifier.collection_idUUID | nullIndexedForeign Key to parent Collection. Nullable if the notebook exists at the workspace root.2titleStringIndexedUser-defined title. Indexed to support autocomplete search functionality across the app.theme_colorStringVisual metadata (hex code) for UI customization.iconStringVisual metadata (emoji or URL).created_atNumberUTC Timestamp.updated_atNumberIndexedSync Timestamp.is_deletedBooleanTombstone.is_dirtyBooleanIndexedSync status flag.

5. Entity Analysis: The Note (Document Root)In a block-based architecture, the "Note" entity changes its fundamental nature. It ceases to be a container of content (like a text file) and becomes a Controller—a metadata shell that defines the existence, properties, and ordered structure of a document, while the actual content resides in the "Cells" entity.7

5.1 The Ordered List ChallengeA Note consists of an ordered list of Cells. There are two primary ways to represent this order in the database:Array of IDs in Note: The Note entity contains a field cell_order: ['id1', 'id2', 'id3'].Pros: The precise order is strictly defined in one place.Cons: Concurrent edits to the order (e.g., two users moving different blocks) result in a conflict on the entire Note record. Resolving this requires complex array merging logic.9Linked List in Cells: Each Cell stores prev_id and next_id.Pros: Granular edits.Cons: Extremely fragile. If one cell is corrupted or fails to sync, the chain breaks, and the document is truncated. Loading requires traversing the list or sorting in memory.24Fractional Indexing (Rank) in Cells: Each Cell stores a rank string (e.g., "a", "b", "c"). To insert between "a" and "b", the new cell gets rank "an".Pros: Sorting is simply ORDER BY rank. Inserting or moving a cell only affects that specific cell's record. No write amplification.Cons: Requires a specialized algorithm to generate keys.This report strongly recommends Fractional Indexing (Strategy 3), as it aligns perfectly with the requirement for offline capabilities and eventual consistency. It minimizes the "blast radius" of any edit operation, reducing the likelihood of sync conflicts.10

5.2 Schema Definition: notesField NameData TypeIndexing StrategyDescription and RationaleidUUID (String)Key PathUnique Identifier.notebook_idUUIDIndexedForeign Key to parent Notebook.titleStringIndexedThe document title. Indexed for global search.cover_imageStringURL or reference ID to a media object.created_atNumberIndexedFor "Recently Created" sorting.updated_atNumberIndexedFor "Recently Modified" sorting and Sync.is_deletedBooleanTombstone.is_dirtyBooleanIndexedSync status flag.Notice the absence of a content field. The content is derived entirely by querying the cells store for items matching this Note's ID.23

6. Entity Analysis: Cells (The Block Layer)The "Cell" (or Block) is the atomic unit of the application. The decision to use a block-based model rather than a rich-text blob mirrors the architecture of modern tools like Notion, which allows for granular permissions, comments on specific paragraphs, and the mixing of diverse content types (code, images, tasks) within a single stream.23

6.1 Polymorphic Schema DesignA Cell is polymorphic; it might be a paragraph of text, a checkbox, an image, or a code snippet. In a relational database, this might be handled via separate tables (text_cells, image_cells) or a single table with many nullable columns. In IndexedDB's NoSQL environment, we can leverage the flexibility of JavaScript objects to store a schema-less content object, while keeping the structural metadata strict.2

6.2 Ordering with Fractional IndexingThe rank field is the linchpin of the ordering system. Using a string-based fractional index (lexicographical order) is superior to floating-point numbers because standard floats suffer from precision limits (after roughly 50 subdivisions, 64-bit floats run out of precision). Strings, however, are arbitrarily precise.Algorithm: To insert between "0.1" and "0.2", we append a character rather than doing math: "0.15". If we run out of space between "0.1" and "0.11", we go to "0.105" (conceptually). The implementation should use a library like fractional-indexing to handle the character encoding and distribution.

28Jitter: To prevent collisions when two users insert items at the exact same position while offline, the algorithm introduces a random "jitter" suffix to the generated rank string. This ensures that rank(UserA)!= rank(UserB) even if they perform the identical action.30

6.3 Schema Definition: cellsField NameData TypeIndexing StrategyDescription and RationaleidUUID (String)Key PathUnique Identifier.note_idUUIDIndexedForeign Key. Crucial: Combined with rank for query efficiency.typeStringEnum: text, h1, h2, todo, image, code, etc..27rankStringIndexedThe Fractional Index. Sortable ASCII string.contentObjectThe polymorphic payload. E.g., { text: "Hello world" } or { url: "img.png", caption: "A photo" }.propertiesObjectBlock-specific settings: { checked: false, language: "python", collapsed: true }.revision_hashStringHash of content for conflict detection.created_atNumberUTC Timestamp.updated_atNumberIndexedSync Timestamp.is_deletedBooleanTombstone.is_dirtyBooleanIndexedSync status flag.

6.4 The Performance Index: Compound IndexingTo render a Note, the application must fetch all Cells belonging to that Note, sorted by rank.We define a compound index on the cells store: index('by_note_rank', ['note_id', 'rank']).This allows the application to open a cursor or use getAll with a key range restricted to to. This operation is extremely efficient in B-Tree based stores like LevelDB (Chrome's backend), as all relevant data blocks are stored contiguously on disk.4

7. Synchronization and Offline ProtocolThe "offline" requirement necessitates a robust synchronization engine. The schema supports this via the "Dirty Flag" and "Tombstone" patterns.

7.1 The Sync LifecycleLocal Edit: When a user edits a cell, the application updates the content field, sets updated_at to the current time, and sets is_dirty = true.Push: A background Sync Worker (Service Worker or Web Worker) queries db.cells.where('is_dirty').equals(true). It bundles these records and sends them to the server.Ack: Upon successful upload, the server returns the confirmed updated_at timestamp. The client updates the local record to is_dirty = false and updates server_updated_at.Pull: The client requests all changes from the server where updated_at > last_local_sync_time. The server responds with a changelog.Merge: The client merges incoming changes.

7.2 Conflict Resolution StrategiesConflict resolution is critical when multiple devices edit the same entity.Last-Write-Wins (LWW): For simple fields like title or theme_color, LWW based on updated_at is generally acceptable. The schema supports this natively via the timestamp fields.19Differential Synchronization / CRDTs: For the content of a text block, LWW is destructive (User A's sentence overwrites User B's sentence). A more advanced implementation involves storing the content not as a raw string, but as a CRDT update vector (e.g., using Yjs or Automerge). In this scenario, the content field in the schema would store a binary blob (Uint8Array) representing the Yjs update. The schema remains the same, but the application logic treats the field as an opaque mergeable binary.32

8. Performance Optimization & Best PracticesDesigning for IndexedDB requires navigating specific performance bottlenecks documented in the research.

8.1 Write Performance: Transaction BatchingIndexedDB transactions have overhead (committing to disk). Writing 100 cells one by one is significantly slower than writing 100 cells in a single transaction. The application architecture should queue UI events (e.g., a rapid typing session) and commit them in batches (e.g., every 500ms or on blur), or ensure that "Import" operations utilize a single read-write transaction for all records.31

8.2 Read Performance: getAll vs. CursorsHistorically, developers used cursors (openCursor) to iterate over data. Research highlights that getAll() (introduced in IDB v2) is drastically faster because it batches the deserialization and transfer of data from the database process to the renderer process, avoiding the IPC overhead of a per-record callback loop. The schema's heavy reliance on indexing (especially the note_id index on Cells) is designed to maximize the utility of getAll().11

8.3 Large Object ManagementBrowser engines, particularly Chrome, optimize storage by compressing large values.34 However, the structured cloning process for very large objects (deeply nested JSON) can still block the main thread.13 The "Cells" architecture naturally mitigates this by breaking a large document into many small records. This "sharding" of the document ensures that the browser only serializes/deserializes small chunks of text at a time, keeping the UI frame rate high (60fps) even when loading a substantial notebook.

9. Comprehensive Schema Implementation ReferenceThe following JSON-like structure serves as a definitive reference for the onupgradeneeded event handler in the IndexedDB initialization logic.JavaScriptconst schema = {
  version: 1,
  stores: {
    // 

1. Collections: Recursive Folder Structure
    collections: {
      keyPath: 'id',
      indexes: [
        { name: 'by_parent', keyPath: 'parent_id', options: { unique: false } },
        { name: 'by_path', keyPath: 'path', options: { unique: false } }, // For subtree queries
        { name: 'sync_dirty', keyPath: 'is_dirty', options: { unique: false } },
        { name: 'updated_at', keyPath: 'updated_at', options: { unique: false } }
      ]
    },

    // 

2. Notebooks: Logical Grouping
    notebooks: {
      keyPath: 'id',
      indexes: [
        { name: 'by_collection', keyPath: 'collection_id', options: { unique: false } },
        { name: 'sync_dirty', keyPath: 'is_dirty', options: { unique: false } },
        { name: 'updated_at', keyPath: 'updated_at', options: { unique: false } }
      ]
    },

    // 

3. Notes: Document Controllers
    notes: {
      keyPath: 'id',
      indexes: [
        { name: 'by_notebook', keyPath: 'notebook_id', options: { unique: false } },
        { name: 'by_title', keyPath: 'title', options: { unique: false } }, // For search
        { name: 'sync_dirty', keyPath: 'is_dirty', options: { unique: false } },
        { name: 'updated_at', keyPath: 'updated_at', options: { unique: false } }
      ]
    },

    // 

4. Cells: Atomic Content Blocks
    cells: {
      keyPath: 'id',
      indexes: [
        { name: 'by_note', keyPath: 'note_id', options: { unique: false } },
        // Compound Index for ordering: efficiently fetch cells for a note in order
        { name: 'by_note_rank', keyPath: ['note_id', 'rank'], options: { unique: false } },
        { name: 'sync_dirty', keyPath: 'is_dirty', options: { unique: false } },
        { name: 'updated_at', keyPath: 'updated_at', options: { unique: false } }
      ]
    },

    // 

5. Local State: Metadata for the app itself (e.g., current user, last sync time)
    local_state: {
      keyPath: 'key'
    }
  }
};
1

0. ConclusionThe architectural design of an offline-first note-taking application using IndexedDB requires a fundamental shift from relational thinking to a model that embraces the constraints and capabilities of the browser environment. By adopting a Materialized Path strategy, the system solves the problem of recursive hierarchy traversal in a Key-Value store. By implementing Fractional Indexing, it resolves the complexity of ordered lists in a distributed system, enabling conflict-free drag-and-drop operations. Finally, by breaking documents into atomic Cells, the schema optimizes for both synchronization efficiency and rendering performance.This design specification provides a robust foundation for building a professional-grade application capable of scaling to thousands of notes while maintaining the responsiveness and reliability users expect from a local-first tool. The integration of tombstone flags and dirty-state tracking ensures that the application is fully prepared for eventual consistency synchronization with a cloud backend, fulfilling the complete set of requirements for a modern, offline-capable productivity suite.