  #Include AHKsock\AHKsock.ahk

  Menu, Tray, Add
  Menu, Tray, Add, Exit gracefully, ExitGracefully

  InputBox, serverAddress, McMillen12Step-bitwig, Enter server address
  InputBox, serverPort, McMillen12Step-bitwig, Enter server port,,,,,,,, 32313

  OutputDebug, Connecting to %serverAddress%:%serverPort%
  AHKsock_ErrorHandler("LogAHKsockError")

  If (connectStatus := AHKsock_Connect(serverAddress, serverPort, "OnNetworkEvent")) {
    OutputDebug, % "Failed to connect with status " connectStatus " and ErrorLevel " ErrorLevel
    ExitApp
  }
Return

ExitGracefully:
  AHKSock_Close()
ExitApp

LogAHKsockError(iError, iSocket) {
  OutputDebug, % "Client - Error " iError " with error code = " ErrorLevel ((iSocket <> -1) ? " on socket " iSocket : "")
}

OnNetworkEvent(eventType, socket=0, name=0, address=0, port=0, ByRef byteData=0, length=0) {
  If (eventType = "CONNECTED") {
    If (socket = -1) {
      MsgBox, Connection failed
      ExitApp
      ; TODO: Reconnect on failure
    } Else {
      MsgBox, Connected successfully
    }
  } Else If (eventType = "DISCONNECTED") {
    MsgBox, Disconnected
    ExitApp
    ; TODO: Try to reconnect instead
  } Else If (eventType = "RECEIVED") {
    MsgBox, Received keystroke
    ; TODO: Send arrow keys
  }
}
