const Post = require("../models/Post");
const User = require("../models/User");
const Lead = require("../models/Lead");

const jwt = require("jsonwebtoken");
const { UserInputError, AuthenticationError } = require("../utils/errors");
const logger = require("../utils/logger");

class leadService {
  async getAllLeads({ limit, offset }) {
    logger.info(`Fetching lead - limit: ${limit}, offset: ${offset}`);

    const [leads, total] = await Promise.all([
      Lead.find().sort({ createdAt: -1 }).limit(limit).skip(offset),
      Lead.countDocuments(),
    ]);

    return {
      leads: leads,
      total,
      hasMore: offset + limit < total,
    };
  }

  async getLeadById(id) {
    logger.info(`Fetching lead with id: ${id}`);
    const lead = await Lead.findById(id);

    if (!lead) {
      throw new Error("Lead not found");
    }

    return lead;
  }

  async createLead(input) {
    try {
      // logger.info(`Creating lead by author: ${input.authorId}`);

      // // Verify author exists
      // const author = await User.findById(input.authorId);
      // if (!author) {
      //   throw new Error("Author not found");
      // }

      const lead = new Lead(input);
      await lead.save();

      logger.info(`Lead created successfully: ${lead._id}`);

      return lead;
    } catch (error) {
      logger.error("Error creating lead:", error);
      throw new Error(`Failed to create lead: ${error.message}`);
    }
  }

  async updateLead({ id, input }) {
    try {
      logger.info(`Updating lead: ${id}`);

      const lead = await Lead.findByIdAndUpdate(
        id,
        { $set: input },
        { new: true, runValidators: true }
      );

      if (!lead) {
        throw new Error("Lead not found");
      }

      logger.info(`Lead updated successfully: ${lead._id}`);

      return lead;
    } catch (error) {
      logger.error("Error creating post:", error);
      throw new Error(`Failed to create lead: ${error.message}`);
    }
  }

  async deleteLead(id) {
    try {
      logger.info(`Deleting lead: ${id}`);

      const lead = await Lead.findByIdAndDelete(id);

      if (!lead) {
        throw new Error("Lead not found");
      }

      logger.info(`Lead deleted successfully: ${lead._id}`);

      return true;
    } catch (error) {
      logger.error("Error creating lead:", error);
      throw new Error(`Failed to delete lead: ${error.message}`);
    }
  }
}

module.exports = new leadService();
