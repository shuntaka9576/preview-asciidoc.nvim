# preview-asciidoc.nvim
It is possible to preview with [Asciidoctor](https://asciidoctor.org/docs/user-manual/) in real time! 

![preview](https://user-images.githubusercontent.com/12817245/73181126-fc5bf080-4159-11ea-8803-060709ea5188.gif)

## Features
* [x] Excute the :AsciidocPreview preview asciidoc in real time
* [ ] AutoScroll

## Requirements
* Neovim
* Node.js("node" command in $PATH)
* asciidoctor("asciidoctor" command in $PATH)
* asciidoctor-diagram

## Install & Usage
install with [dein](https://github.com/Shougo/dein.vim.git)
```vim
" .vim config
call dein#add('shuntaka9576/preview-asciidoc.nvim', { 'build': 'yarn install', 'merged': 0 } )
```
```toml
# .toml config
[[plugins]]
repo = 'shuntaka9576/preview-asciidoc.nvim'
build = 'yarn install'
merged = 0
```

usage
```
:AsciiDocPreview
```

## Config
```vim
" set to node path
" default "node" command in $PATH
let g:padoc_node_path = '~/.anyenv/envs/nodenv/shims/node'

" set to lunch port
" default 9136
let g:padoc_lunch_port='6060'

" set asciidoc build command
" deafult `asciidoctor -r asciidoctor-diagram`
let g:padoc_build_command = 'asciidoctor -r asciidoctor-diagram'
```

## Contribution
```
export NVIM_PADOC_LOG_LEVEL=debug
export NVIM_PADOC_LOG_FILE=/tmp/padoc.log
yarn install
```
