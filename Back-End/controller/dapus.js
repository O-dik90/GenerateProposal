const ProposalBab = require('../models/proposal-bab');
const Cite = require('citation-js');

const formatCitations = (citationData) => {
  try {
    if (typeof citationData !== 'string') {
      citationData = JSON.stringify(citationData);
    }
    // Replace all underscores with hyphens
    citationData = citationData.replace(/_/g, '-');
    const citation = new Cite(citationData);

    return citation.format('bibliography', {
      format: 'text',
      style: citationData.style || 'mla',
      lang: 'en',
    });
  } catch (error) {
    return `Error formatting citation: ${error.message}`;
  }
};

const sortCitations = (citations) => {
  return citations.sort((a, b) => {
    const textA = a.toString().toLowerCase();
    const textB = b.toString().toLowerCase();
    return textA.localeCompare(textB);
  });
};

const genCitations = async (req, res) => {
  try {
    const citationsArray = req.body.citations;

    if (!Array.isArray(citationsArray) || citationsArray.length === 0) {
      return res.status(400).json({
        message: 'Invalid input. Please provide an array of citation data.',
      });
    }

    const formattedCitations = formatCitations(citationsArray);
    const sortedCitations = sortCitations(formattedCitations);

    return res.json({
      message: 'success',
      citations: sortedCitations,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message,
    });
  }
};

const updateDapus = async (req, res) => {
  try {
    const params = req.body;

    if (!params?.id) {
      return res.status(400).json({
        message: 'Invalid input: Missing required field `id`.',
      });
    }
    if (!params?.json_data) {
      return res.status(400).json({
        message: 'Invalid input: Missing required field `json_data`.',
      });
    }

    const newData = params.json_data.map((data) => {
      const genCitations = formatCitations(data);
      return {
        ...data,
        citation: genCitations,
      };
    });

    const [updateData] = await ProposalBab.updateBab(
      params.id,
      JSON.stringify(newData)
    );

    if (!updateData || updateData.length === 0) {
      return res.status(404).json({
        message: 'Failed to update data: Data not found or invalid.',
      });
    }

    const [detailDapus] = await ProposalBab.getDetailProposalBab(
      params.id,
      params.proposals_id
    );

    if (!detailDapus || detailDapus.length === 0) {
      return res.status(404).json({
        message: 'Details not found for the provided id.',
        data: [],
      });
    }

    return res.status(200).json({
      message: 'Success',
      updatedData: detailDapus,
    });
  } catch (error) {
    console.error('Error in updateDapus:', error.message);
    return res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message,
    });
  }
};

module.exports = {
  updateDapus,
  genCitations,
};
