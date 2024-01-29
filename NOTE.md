# MongoDB Tables Schema

## User

    id - String - ObjectID
    name - string
    email - string
    password - string
    createdAt - Date

## Search

    id - string - ObjectID
    searchString - string[]
    searchedAt - DateTime
    userId - User - ObjectID

## Admin

    id - String - ObjectID
    name - String
    email - String
    password - String

## Like

    id - String
    gif - String
    gifId - String
    userId - User - ObjectID
    likedAt - DateTime
    status - Boolean
    searchString - String[]

<!-- Database Password -->

    tanmaypanda752
    alphabi-giphy

## Graph

1. graph shows users search like time line data ✅
2. graph shows top keywords searched & most like gifs in a keyword in respect to count ✅
3. a table shows the most active user from top ✅
4. a table shows the most liked gifs in the table ✅
