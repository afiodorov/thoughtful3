export function formatMultiLineText(text: string): string {
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>');
}

export function formatSingleLineText(text: string): string {
  return text;
}

export function formatDate(timestampSeconds: number): string {
  const date = new Date(timestampSeconds * 1000);
  const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date
    .getFullYear()
    .toString()
    .slice(-2)} ${date.getHours()}:${date.getMinutes()}`;

  return dateString;
}
