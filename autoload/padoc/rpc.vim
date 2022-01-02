let s:padoc_channel_id = -1

function! s:on_stdout(chan_id, msgs, ...) abort
  call padoc#util#echo_messages('Error', a:msgs)
endfunction
function! s:on_stderr(chan_id, msgs, ...) abort
  call padoc#util#echo_messages('Error', a:msgs)
endfunction
function! s:on_exit(chan_id, code, ...) abort
  let s:padoc_channel_id = -1
  " let g:padoc_node_channel_id = -1
endfunction

function! padoc#rpc#server_status()
  if s:padoc_channel_id ==# -1
    return -1
  endif
  return 1
endfunction

function! padoc#rpc#start_server()
  let job_cmd = padoc#util#job_command()

  let s:padoc_channel_id = jobstart(job_cmd, {
        \ 'on_stdout': function('s:on_stdout'),
        \ 'on_stderr': function('s:on_stderr'),
        \ 'on_exit': function('s:on_exit')
        \ })
endfunction

function! padoc#rpc#open_browser()
  if exists('g:padoc_node_channel_id') && g:padoc_node_channel_id !=# -1
    call rpcnotify(g:padoc_node_channel_id, 'open_browser', { 'bufnr': bufnr('%') })
  endif
endfunction

function! padoc#rpc#refresh_content()
  if exists('g:padoc_node_channel_id') && g:padoc_node_channel_id !=# -1
    call rpcnotify(g:padoc_node_channel_id, 'refresh_content', { 'bufnr': bufnr('%') })
  endif
endfunction

function! padoc#rpc#refresh_view()
  if exists('g:padoc_node_channel_id') && g:padoc_node_channel_id !=# -1
    call rpcnotify(g:padoc_node_channel_id, 'refresh_view', { 'bufnr': bufnr('%') })
  endif
endfunction

