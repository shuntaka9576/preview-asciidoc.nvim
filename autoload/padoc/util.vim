let g:padoc_root_dir = expand('<sfile>:h:h:h')

function! padoc#util#job_command()
  let node_path = get(g:, 'padoc_node_path', 'node') 
  return [node_path] + [g:padoc_root_dir . '/app/lib/server.js']
endfunction

function! padoc#util#echo_messages(hl, msgs)
  if empty(a:msgs) | return | endif
  execute 'echohl '.a:hl
  if type(a:msgs) ==# 1
    echomsg a:msgs
  else
    for msg in a:msgs
      echom msg
    endfor
  endif
  echohl None
endfunction

function! padoc#util#preview_adoc()
  let l:server_status = padoc#rpc#server_status()
  if l:server_status !=# 1
    call padoc#rpc#start_server()
  else
    call padoc#rpc#open_browser()
  endif
endfunction
