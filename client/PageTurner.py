#!/usr/bin/env python

import argparse
import autopy
import socket
import time

from sockutil import set_tcp_keepalive

def handleCommand(command):
  # print command # XXX
  if command == 'D':
    print 'Page Down'
    autopy.key.tap(autopy.key.K_PAGEDOWN)
  elif command == 'U':
    print 'Page Up'
    autopy.key.tap(autopy.key.K_PAGEUP)

def connectAndListen(host, port):
  sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
  # Turn on keepalive with a 1 second timeout, 1 attempt (not set on Mac and
  # Windows), and 1 second interval between tries (not set on Mac). Small values
  # because some network noise is better than a performance ruined by a page
  # that didn't turn.
  try:
    sock.connect((host, port))
    set_tcp_keepalive(sock, True, 1, 1, 1)
  except socket.error as error:
    print 'Failed to connect:', error
    return
  print 'Connected'
  while True:
    char = ""
    try:
      char = sock.recv(1)
    except socket.error:
      pass
    if not char:
      print 'Connection lost'
      return
    handleCommand(char)

def main(args):
  while True:
    print 'Attempting to connect to', args.host + ':' + str(args.port)
    connectAndListen(args.host, args.port)
    time.sleep(1)
  # TODO: Handle ctrl-c

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='Remote page turn client')
  parser.add_argument('host', type=str,
      help='the host, typically running Bitwig Studio and the \
      McMillen12Step-bitwig controller script')
  parser.add_argument('-p', '--port', type=int, default=32313,
      help='the port to connect to (default 32313)')

  main(parser.parse_args())
