class Utils {
  static showElement(element) {
    element.style.display = "block";
    element.hidden = false;
  }

  static hideElement(element) {
    element.style.display = "none";
    element.hidden = true;
  } 

  static isPositiveFiniteInteger(value) {
    return (
      Number.isInteger(Number(value)) &&
      Number.isFinite(Number(value)) &&
      Number(value) > 0
    );
  }
}

export default Utils;
