import * as file from '@taufik-nurrohman/file';
import * as folder from '@taufik-nurrohman/folder';

import cleancss from 'clean-css';
import sass from 'node-sass';

const minifier = new cleancss({
    level: 2
});

function factory(from, to, options = {}) {
    sass.render(Object.assign({
        file: from,
        outputStyle: 'expanded'
    }, options), (error, result) => {
        if (error) {
            throw error;
        }
        file.setContent(to, result.css);
        minifier.minify(result.css, (error, result) => {
            if (error) {
                throw error;
            }
            file.setContent(to.replace(/\.css$/, '.min.css'), result.styles);
        })
    });
}

factory('.source/-/index.scss', 'index.css');
