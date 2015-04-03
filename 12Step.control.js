loadAPI(1);

host.defineController("Keith McMillen", "12 Step", "0.1.0", "22f76bfc-789d-43ef-8468-71ab2f645b12", "Albert Armea");
host.defineMidiPorts(1, 0);
host.addDeviceNameBasedDiscoveryPair(["12Step"], []);

function init()
{
  host.getMidiInPort(0).setMidiCallback(onMidi);
}

function exit()
{}

function onMidi(midiStatus, data1, data2)
{
  var channel = midiStatus & 0x0F;
  var eventType = midiStatus & 0xF0;

  if (channel != 0)
  {
    return;
  }

  switch (eventType)
  {
    // Note off
    case 0x80:
      // TODO
      host.println("Note off " + data1);
      break;
    // Note on
    case 0x90:
      host.println("Note on " + data1);
      // TODO
      break;
  }
}
