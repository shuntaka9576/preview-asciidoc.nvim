function! padoc#autocmd#init() abort
  execute 'augroup PADOC_REFRESH_INIT' . bufnr('%')
    autocmd!
    autocmd BufWritePost,CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer> :call padoc#rpc#refresh_content()
    autocmd CursorMoved,CursorMovedI <buffer> :call padoc#rpc#refresh_view()
  augroup END
endfunction
