// Spread onto a <Text>/<View> to opt it back into text selection on web/desktop,
// where selection is disabled globally (see app/+html.tsx). Renders as a
// data-selectable="true" attribute that the global CSS targets. Typed as `any`
// because `dataSet` is a React-Native-Web-only prop, absent from RN's types.
export const selectable: any = { dataSet: { selectable: 'true' } };
