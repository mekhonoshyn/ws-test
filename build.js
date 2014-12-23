/**
 * Created by mekhonoshyn on 22-Dec-14.
 */

var builder = require('useful-utils');

builder.client('external-utils', {
    demo: [
        'WSCli',
        'DragNDrop'
    ]
});

builder.server('external-utils', [
    'WSSrv',
    'DateTime'
]);