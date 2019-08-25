# SLS Rest Component

## Example

```yml
name: app

restEndpoint:
    component: @dodgeblaster/rest # not published to npm yet
    inputs:
        schema:
            id: '@primary string'
            name: '@sort string'
            job: 'string'
            age: 'string'
```

-   Adding @primary to a type defines that key as the Partition Key
-   Adding @sort to a type defines that key as the Sort Key

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
