const Cite = require('citation-js');

const formatCitations = (citationData) => {
  try {
    if (typeof citationData !== 'string') {
      citationData = JSON.stringify(citationData);
    }

    citationData = citationData.replace(/_/g, '-');
    const citation = new Cite(citationData);

    return citation.format('bibliography', {
      format: 'text',
      style: citationData.style || 'apa',
      lang: 'en',
    });
  } catch (error) {
    return `Kesalahan format: ${error.message}`;
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
        message: 'Kesalahan input. Tolong sediakan data array.',
      });
    }

    const formattedCitations = citationsArray.map(formatCitations);

    const sortedCitations = sortCitations(formattedCitations);

    return res.json({
      message: 'success',
      citations: sortedCitations,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Kesalahan server',
      serverMessage: error.message,
    });
  }
};

module.exports = {
  formatCitations,
  genCitations,
};