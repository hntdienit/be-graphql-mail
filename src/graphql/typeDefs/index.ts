export const TypeDefs = [
  `#graphql  
    type Header {
        name: String!
        value: String!
    }
    type Body {
        size: Int!
        data: String
        attachmentId: String
    }
    type Payload {
        partId: String!
        mimeType: String!
        filename: String!
        headers: [Header!]!
        body: Body!
        parts: [Payload!]
    }
    type Email {
        id: String!
        threadId: String!
        labelIds: [String!]!
        snippet: String!
        payload: Payload!
        sizeEstimate: Int!
        historyId: String!
        internalDate: String!
    }

    type EmailList {
    id: String!
    threadId: String!
    }

    type Query {
        emailList: [EmailList]
        emailByPk(id: String!): Email
    }
    
    type Mutation {
        hello: String!
    }
  `,
];
