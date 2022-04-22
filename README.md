#GraphQL with Node.js and Express

##### GraphQL :
- GraphQL is defined as a query language for client APIs and server-side runtime to execute those queries. That said, GraphQL is not exactly a language, but it has its own syntax and can be developed within several programming languages, such as Node. js.

##### Use of GraphQL :
- A GraphQL schema is used to describe the complete APIs type system. It includes the complete set of data and defines how a client can access that data. Each time the client makes an API call, the call is validated against the schema.

##### Purpose of GraphQL :
- GraphQL is designed to make APIs fast, flexible, and developer-friendly. It can even be deployed within an integrated development environment (IDE) known as GraphiQL.

##### Benefits of GraphQL:
- GraphQL offers many benefits over REST APIs. One of the main benefits is clients have the ability to dictate exactly what they need from the server, and receive that data in a predictable way.

##### Prerequisites:
- Node.js & MongoDB installed locally,

##  Steps to run

##### Step 1 — Setting Up GraphQL with Node
- First, create a GraphQL directory : `mkdir GraphQL`
- Change into the new directory : `cd GraphQL`
- Initialize an npm project : `npm init -y`
- Then create the server.js file which will be the main file : `touch server.js`
- Required dependencies:
  
        "express": "^4.17.3",
        "express-graphql": "^0.12.0",
        "graphql": "^16.3.0",
        "mongoose": "^6.3.0",
        "nodemon": "^2.0.15"


##### Step 2 — Defining a Schema

- In GraphQL, the Schema manages queries and mutations, defining what is allowed to be executed in the GraphQL server.
- While we use queries to fetch data, we use mutations to modify server-side data.
- If queries are the GraphQL equivalent to GET calls in REST, then mutations represent the state-changing methods in REST (like DELETE , PUT , PATCH , etc). 
- In simple words the query is SELECT statement and mutation is INSERT Operation. Query in graphql is used to fetch data while mutation is used for INSERT/UPDATE/DELETE operation.
- You can define different types inside buildSchema,You’ll make your schema a bit complex by adding some reasonable types. For instance, you want to return a user and an array of users of type Person, who have an id, name, age, and their favorite shark properties.

        const schema = buildSchema(`
            type Query {
                user(id: ID): Person
                users(shark: String): [Person]  
            },
            type Person {
                id: ID
                name: String
                age: Int
                shark: String
            },
            type Mutation {
                createUser(name : String,age : Int,shark : String) : Person
                updateUser(id : ID,name : String,age : Int,shark : String) : Person
                deleteUser(id : ID) : [Person]
            }
        `);


##### Step 3 — Defining Resolvers
- Resolver is a collection of functions that generate response for a GraphQL query. In simple terms, a resolver acts as a GraphQL query handler.
- You’ll also create some sample users for this functionality and create function for retriving and manipulate the data.
- Add these new lines of code to server.js right after the buildSchema lines of code, but before the root lines of code:

        let root = {
            user: getSingleUser,     // Resolver function to return user with specific id
            users: retrieveUsers,    //Resolver unction to return all users
            createUser: createUser,  //Resolver function for create user
            updateUser: updateUser, //Resolver function for update user
            deleteUser: deleteUser  //Resolver function for delete user
        };


##### Step 4 — Defining Aliases
- If you need to retrieve two different users, you may be wondering how you would identify each user. In GraphQL, you can’t directly query for the same field with different arguments. 
- Let’s define like this.
  
        query getUsersWithAliases($userAID: Int!, $userBID: Int!) {
                userA: user(id: $userAID) {
                    name
                    age
                    shark
                },
                userB: user(id: $userBID) {
                    name
                    age
                    shark
                }
            }

##### Step 5 — Creating Fragments
-  GraphQL includes reusable units called fragments.
   
        query getUsersWithFragments($userAID: Int!, $userBID: Int!) {
            userA: user(id: $userAID) {
                 ...userFields
            },
            userB: user(id: $userBID) {
                 ...userFields
            }
        }

        fragment userFields on Person {
            name
            age
            shark
        }

##### Step 6 — Defining Directives
- Directives enable us to dynamically change the structure and shape of our queries using variables.
- The two available directives are as follows:
    
    `@include(if: Boolean)`- Only include this field in the result if the argument is true.
    
    `@skip(if: Boolean)`- Skip this field if the argument is true.
  
        query getUsers($shark: String, $age: Boolean!, $id: Boolean!) {
            users(shark: $shark){
                 ...userFields
            }
        }

        fragment userFields on Person {
            name
            age @skip(if: $age)
            id @include(if: $id)
        }

##### Step 7 — GraphQL endpoint 
- Create an express server and a GraphQL endpoint
  
        let app = express();
        app.use('/graphql', graphqlHTTP({
        schema: schema,  // Must be provided
        rootValue: root,
        graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
        }));
        app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));
- Now browse to `localhost:4000/graphql`




## Run this queries in browser

- Get single user
  
        query getSingleUser($userID: ID! = "626137961a6e6aef7a481a1b") {
            user(id: $userID) {
                name
                age
                shark
            }
        }

- Retrieve users
  
        query getUsers($shark: String = "Hammerhead Shark",$age: Boolean! = true,$name: Boolean! = true) {
            users(shark: $shark){
              ...userFields
            }
        }

        fragment userFields on Person {
            name @include(if:$name)
            age @skip(if: $age)
            shark
        }

- Create new user

        mutation create($name: String! = "pooniiii", $age: Int! = 21,$shark : String! = "aaa"){
            createUser(name:$name, age: $age,shark : $shark){
                ...userFields
            }
        }

        fragment userFields on Person {
            name
            age
            shark
        }

- Update user

        mutation updateUser($id: ID! = "626131f89faad4bf4a82d011", $name: String! = "pooniiii", $age: Int! = 21,$shark : String! = "aaa") {
            updateUser(id: $id, name:$name, age: $age,shark : $shark){
              ...userFields
            }
        }

        fragment userFields on Person {
            name
            age
            shark
        }

- Delete user

        mutation deleteUser($id : ID! = "626131f89faad4bf4a82d011") {
            deleteUser(id :$id){
                name
                age
                shark
            }
        }