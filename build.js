const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');
const frontMatter = require('front-matter');

// Base directories
const contentDir = path.join(__dirname, 'content');
const publicDir = path.join(__dirname, 'public');
const templateDir = path.join(__dirname, 'templates');

// Ensure directories exist
fs.ensureDirSync(publicDir);

// Read and process template
const template = fs.readFileSync(path.join(templateDir, 'base.html'), 'utf-8');

function buildPage(markdown, templateHtml) {
    const { attributes, body } = frontMatter(markdown);
    const htmlContent = marked(body);
    return templateHtml
        .replace('{{title}}', attributes.title || 'My Site')
        .replace('{{content}}', htmlContent);
}

async function build() {
    // Copy static assets
    await fs.copy(path.join(__dirname, 'static'), path.join(publicDir, 'static'));

    // Process markdown files
    const files = await fs.readdir(contentDir);
    for (const file of files) {
        if (file.endsWith('.md')) {
            // Skip processing index.md as we'll use the static index.html
            if (file === 'index.md') continue;
            
            const markdown = await fs.readFile(path.join(contentDir, file), 'utf-8');
            const html = buildPage(markdown, template);
            
            // Create proper URL structure
            const basename = path.basename(file, '.md');
            const outPath = path.join(publicDir, basename, 'index.html');
            
            // Ensure directory exists
            await fs.ensureDir(path.dirname(outPath));
            await fs.writeFile(outPath, html);
        }
    }
}

build().catch(console.error); 