const genMLA = (data) => {
  let { category, author, title, publisher, year, url, volume, issue } = data;

  if (author) {
    switch (author.length) {
      case 1:
        author = `${author[0]}`;
        break;
      case 2:
        author = `${author[0]} and ${author[1]}`;
        break;
      default:
        author = `${author[0]}, et al.`;
        break;
    }
  }

  switch (category) {
    case 'journal':
      return {
        ...data,
        res: `${author}. "${title}." *${publisher}*, ${year}, ${volume}, ${issue}.`,
      };
    case 'book':
      return {
        ...data,
        res: `${author}. *${title}*. ${publisher}, ${year}.`,
      };
    case 'url':
      return {
        ...data,
        res: `${author}. "${title}." *${publisher}*, ${year}, ${url}.`,
      };
    default:
      return 'Invalid category';
  }
};

const addDapus = async (req, res) => {
  try {
    const params = req.body;
    const citations = params.map((item) => genMLA(item));

    res.status(200).json({
      message: 'success',
      data: citations,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      serverMessage: error.message,
    });
  }
};

module.exports = {
  addDapus,
};
