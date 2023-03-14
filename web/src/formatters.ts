function detectLinks(stringWithLinks: string): string {
  const linkRegex = /(?<prefix>https?:\/\/|tinyurl.com\/)(?<suffix>[^\s]+)/g;
  return stringWithLinks.replace(linkRegex, function (_, prefix: string, suffix: string): string {
    let urlPrefix = prefix;

    if (prefix !== 'http://' && prefix !== 'http://') {
      urlPrefix = `https://${prefix}`;
    }

    return `<a href="${urlPrefix}${suffix}">${prefix}${suffix}</a>`;
  });
}
export function formatMultiLineText(text: string): string {
  const res = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return detectLinks(res).replace(/\n/g, '<br>');
}

export function formatSingleLineText(text: string): string {
  return text;
}

export function formatDate(timestampSeconds: number): string {
  const date = new Date(timestampSeconds * 1000);
  const dateString = `${date.getDate()}/${date.getMonth() + 1}/${date
    .getFullYear()
    .toString()
    .slice(-2)} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;

  return dateString;
}

export function cropAddress(str: string): string {
  if (window.matchMedia('(max-width: 767px)').matches) {
    return str.substring(0, 10) + '...' + str.substring(str.length - 2);
  }

  return str;
}
