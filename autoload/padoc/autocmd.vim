function! padoc#autocmd#init() abort
  execute 'augroup PADOC_REFRESH_INIT' . bufnr('%')
    autocmd!
    autocmd BufWritePost,CursorHold,CursorHoldI,CursorMoved,CursorMovedI <buffer> :call padoc#rpc#refresh_content()
    let padoc_experimental_auto_scroll = get(g:, "padoc_experimental_auto_scroll", 0)
    if padoc_experimental_auto_scroll == 1
      autocmd CursorMoved,CursorMovedI <buffer> :call padoc#rpc#refresh_view()
    endif
  augroup END
endfunction
