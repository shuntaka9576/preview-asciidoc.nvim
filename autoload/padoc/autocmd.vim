function! padoc#autocmd#init() abort
  execute 'augroup PADOC_REFRESH_INIT' . bufnr('%')
    autocmd!
    autocmd BufWritePost <buffer> :call padoc#rpc#refresh_content()
    autocmd CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer> :call padoc#rpc#refresh_content()
  augroup END
endfunction
