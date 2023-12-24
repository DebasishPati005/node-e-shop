// Create a function to align and pad text
exports.alignText = (text, width, alignment) => {
  const padLength = width - text.toString().length;
  if (alignment === 'right') {
    return ' '.repeat(padLength) + text;
  } else {
    return text + ' '.repeat(padLength);
  }
};
