# SLS Rest Component

## Example

```yml
name: app

restEndpoint:
    component: @dodgeblaster/rest # not published to npm yet
    inputs:
        schema:
            name: 'string'
            age: 'string'
```


## Progress

Currently has the following http endpoints:
```
GET (get all)
POST (add item)
```

Does not yet have the following http endpoints:
```
GET with query string (get single item)
UPDATE (update single item)
DELETE (remove single item)
```
