import { getMetadata } from '../utils/utils.js';

function isDynamicNavDisabled() {
  const dynamicNavDisableValues = getMetadata('dynamic-nav-disable');
  if (!dynamicNavDisableValues) return false;

  const metadataPairsMap = dynamicNavDisableValues.split(',').map((pair) => pair.split(';'));
  return metadataPairsMap.some(([metadataKey, metadataContent]) => {
    const metaTagContent = getMetadata(metadataKey.toLowerCase());
    return (metaTagContent?.toLowerCase().trim() === metadataContent.toLowerCase().trim());
  });
}

export default function dynamicNav(url, key) {
  if (isDynamicNavDisabled()) return url;
  const metadataContent = getMetadata('dynamic-nav');

  if (metadataContent === 'entry') {
    window.sessionStorage.setItem('gnavSource', url);
    window.sessionStorage.setItem('dynamicNavKey', key);
    return url;
  }

  if (metadataContent !== 'on' || key !== window.sessionStorage.getItem('dynamicNavKey')) return url;

  return window.sessionStorage.getItem('gnavSource') || url;
}
