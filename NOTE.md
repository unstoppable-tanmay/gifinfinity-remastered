# MongoDB Tables Schema

## User
    id - String - ObjectID
    name - string
    email - string
    password - string
    createdAt - Date
    featured - string[]
    liked - string[]

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
    gifId - String
    userId - User - ObjectID
    gifUrl - String
    gifName - String
    likedAt - DateTime
    status - Boolean




<!-- Database Password -->

    tanmaypanda752
    alphabi-giphy




## Graph

1. graph shows searches/uses per a unit time
2. graph shows users creation rate and user count in respect to unit time
3. graph shows likes on search and in a unit time
4. graph shows top keywords searched in respect to count
5. a table shows the most active user from top
6. a table shows the most liked gifs in the table
