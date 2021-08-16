const fs = require('fs')
const path = require('path')
const addStyleElement = require('./addStyleElement')
const moveAllFillToStyle = require('./moveAllFillToStyle')
const { extendDefaultPlugins, optimize } = require('svgo')

const plugins = extendDefaultPlugins([
  {
    name: 'inlineStyles',
    active: false
  },
  {
    name: 'mergeStyles',
    active: false
  },
	{
		name: 'convertShapeToPath',
		active: false
	},
	addStyleElement,
	moveAllFillToStyle
])

async function readFile(filePath, outPath) {
  const data = await fs.promises.readFile(filePath, 'utf8')
	const result = optimize(data, { path: filePath, plugins })
	const done = fs.promises.writeFile(outPath, result.data)
}

function readDir() {
	const directory = path.resolve(__dirname, 'old')
	const outDir = path.resolve(__dirname, 'new')
	fs.readdir(directory, (err, files) => {
		if (err) {
			throw err
		}

		files.forEach(async (filename) => {
			const filePath = path.resolve(directory, filename)
			const outFilePath = path.resolve(outDir, filename)
			await readFile(filePath, outFilePath)
		})
	})
}

readDir()