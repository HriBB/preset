# TODO

Run introspection query

```
{
  __schema {
    types {
      kind
      name
      interfaces {
        name
        description
      }
    }
  }
}
```

```
{
  __type(name:"Post") {
    kind
    name
    description
    fields {
      name
      args {
        description
        defaultValue
      }
    }
  }
}
```
