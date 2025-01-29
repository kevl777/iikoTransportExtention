Dim objWshShell, lc
set objWshShell = WScript.CreateObject("WScript.Shell")
lc = objWshShell.Run("node index.js", 0, false)
set objWshShell = nothing