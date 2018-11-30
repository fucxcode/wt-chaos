# rebuild & test
```
npm run-script test
```

# test without build
```
npm run-script test-only
```

# publish
```
npm run-script pub
```
This will the following commands:
- update patch version
- rebuild
- test
- commit and push the version changes in `package.json`
- publish to `npm`
