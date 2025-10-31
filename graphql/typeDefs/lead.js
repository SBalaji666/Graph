const leadTypeDefs = `#graphql
  type Lead {
    id: ID!
    title: String!
    firstName: String!
    lastName: String!
    email: String!
    company: [ID]
    phone: String!
    status: String!
    segment: [String]
    description: String!
    assigned: [ID!]!
    isActive: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input createLeadInput { 
    title: String!
    firstName: String!
    lastName: String!
    email: String!
    company: [ID]
    phone: String!
    status: String!
    segment: [String]
    description: String!
    assigned: [ID!]!
    isActive: Boolean!
  }

  input updateLeadInput { 
    title: String!
    firstName: String!
    lastName: String!
    email: String!
    isActive: Boolean!
  }

  type LeadList {
    leads: [Lead]
    total: Int
    hasMore: Boolean
  }

  type Query {
    leads(limit: Int, offset: Int): LeadList
    lead(id: ID!): Lead
  }

  type Mutation {
    createLead(input: createLeadInput!): Lead!
    updateLead(id: ID!, input: createLeadInput!): Lead!
    deleteLead(id: ID!): Boolean!
  }
`;

module.exports = leadTypeDefs;
