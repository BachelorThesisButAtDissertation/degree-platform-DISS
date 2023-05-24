import React from 'react';
import { Input } from 'rsuite';

const Textarea = React.forwardRef((props, ref) => (
    <Input {...props} as='textarea' ref={ref} />
));

Textarea.displayName = 'Textarea2'

export default Textarea;
