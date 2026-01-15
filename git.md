## Pushing changes in "main" to "release/main"
```
# Switch to release/main branch
git checkout release/main

# Merge main into release/main
git merge main

# Push the updates
git push origin release/main
```

## Pushing changes in "main" to "release/main" without switching branches
```
# Push main to release/main directly
git push origin main:release/main
```