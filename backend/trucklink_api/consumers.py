import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class MatchingConsumer(AsyncWebsocketConsumer):
    GROUP_NAME = "trucklink_realtime"

    async def connect(self):
        self.room_group_name = self.GROUP_NAME

        # Join realtime broadcast group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send welcome payload
        await self.send(text_data=json.dumps({
            'type': 'SYSTEM_CONNECTED',
            'status': 'Connected to TruckLink Real-time Channel Layer',
            'channel_name': self.channel_name,
            'timestamp': str(self.channel_layer)
        }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket client
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            action = data.get('action')

            if action == 'ping':
                await self.send(text_data=json.dumps({
                    'type': 'PONG',
                    'timestamp': data.get('timestamp')
                }))
            elif action == 'broadcast_test':
                # Broadcast custom message to all connected clients
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'realtime_event',
                        'event_type': 'USER_TEST_MESSAGE',
                        'payload': {
                            'sender': data.get('sender', 'Client'),
                            'message': data.get('message', 'Hello TruckLink Realtime!')
                        }
                    }
                )
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'ERROR',
                'message': str(e)
            }))

    # Handler for group event messages
    async def realtime_event(self, event):
        # Send event to WebSocket client
        await self.send(text_data=json.dumps({
            'type': event.get('event_type', 'EVENT'),
            'payload': event.get('payload', {})
        }))


# Helper utility function to broadcast events from Django Views / Signals
def broadcast_realtime_event(event_type, payload):
    channel_layer = get_channel_layer()
    if channel_layer:
        async_to_sync(channel_layer.group_send)(
            MatchingConsumer.GROUP_NAME,
            {
                'type': 'realtime_event',
                'event_type': event_type,
                'payload': payload
            }
        )
