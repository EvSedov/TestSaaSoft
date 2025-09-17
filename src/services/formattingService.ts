export default {
  // Преобразование строки меток в массив
  parseLabels(labelString: string | undefined): { text: string }[] {
    if (!labelString) return [];

    return labelString
      .split(";")
      .map((s) => s.trim())
      .map((s) => ({ text: s }));
  },

  // Преобразование массива меток в строку
  formatLabels(labels: { text: string }[]): string {
    return labels?.map((item) => item.text).join("; ") || "";
  },
};
