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
This will update the patch version, rebuild, test and then publish to npm. Do NOT forget to run `git push` to save the latest version information to github.
