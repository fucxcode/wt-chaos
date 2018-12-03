# versioning and backward capability principle
- major version: breaking changes without backward capability
- minor version: new interface added and/or existing interface modification but keep existing ones backward capability
- patch version: implementation modification with no interface change

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
