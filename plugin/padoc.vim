function! s:start_plugin() abort
  call padoc#autocmd#init()
  command! -buffer AsciiDocPreview call padoc#util#preview_adoc()
endfunction

function! s:init() abort
  au BufEnter *.{adoc,asciidoc} :call s:start_plugin()
endfunction

call s:init()
