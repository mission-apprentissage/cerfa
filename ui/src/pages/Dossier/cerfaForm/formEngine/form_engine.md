#Field

## Api field definition

- pattern
- minLength
- maxLength
- min
- max
- enum

## Front field definition

- label
- description
- example
- required
- masks
- fieldType
- options
- requiredMessage
- validateMessage

## Field instance + definitions

- locked
- value
- loading
- success
- error
- message ?

# Logics

### What's that ?

Logics are the rules that defines the form behavior.  
They can trigger an error or trigger other fields modifications.

Rules are played in the order they are defined and only if it has a dependency with the last changed value.
