const leadService = require('../../services/leadService');

const leadResolvers = {
  Query: {
    leads: async (_, { limit, offset }, { user }) => {
      return await leadService.getAllLeads({ limit, offset });
    },
    lead: async (_, { id }, { user }) => {
      return await leadService.getLeadById(id);
    },
  },

  Mutation: {
    createLead: async (_, { input }, { user }) => {
      return await leadService.createLead(input);
    },
    updateLead: async (_, { id, input }, { user }) => {
      return await leadService.updateLead({ id, input });
    },
    deleteLead: async (_, { id }, { user }) => {
      return await leadService.deleteLead(id);
    },
  },
};

module.exports = leadResolvers;
