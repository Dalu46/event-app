"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EventCard } from "@/components/event-card";
import { AddEventDialog } from "@/components/ui/add-event-dialog";

export type Event = {
  id: string;
  name: string;
  location: string;
  date: string;
  venue: string;
};

export default function EventBookingApp() {
  const [events, setEvents] = useState<Event[]>([]);
  const event: Event[] = [
    {
      id: "1",
      name: "Summer Music Festival",
      location: "Central Park, New York",
      date: "2023-07-15",
      venue: "Outdoor Stage",
    },

    {
      id: "2",
      name: "Tech Conference 2023",
      location: "San Francisco, CA",
      date: "2023-09-22",
      venue: "Convention Center",
    },

    {
      id: "3",
      name: "Food & Wine Expo",
      location: "Paris, France",
      date: "2023-10-05",
      venue: "Exhibition Hall",
    },
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("YOUR_HASURA_GRAPHQL_ENDPOINT", {
          // Replace with your Hasura endpoint
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-hasura-admin-secret": "YOUR_HASURA_ADMIN_SECRET", // Only use this if you want to bypass authorization, NOT RECOMMENDED FOR PRODUCTION
          },
          body: JSON.stringify({
            query: `
              query MyQuery {
                events {
                  id
                  name
                  location
                  date
                  venue
                }
              }
            `,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            `HTTP error! status: ${response.status} message: ${errorData.errors[0].message}`
          );
        }

        const data = await response.json();
        setEvents(data.data.events);
      } catch (err: any) {
        console.log(err.message);
      } finally {
        // setLoading(false);
        console.log("data fetched");
      }
    };

    fetchEvents();
  }, []);

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const handleVenueChange = (id: string, newVenue: string) => {
    setEvents(
      events.map((event) =>
        event.id === id ? { ...event, venue: newVenue } : event
      )
    );
  };

  const handleAddEvent = (newEvent: Omit<Event, "id">) => {
    setEvents([...events, { ...newEvent, id: Date.now().toString() }]);
    setIsAddEventOpen(false);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Event Booking App</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={() => setIsAddEventOpen(true)}>Add New Event</Button>
        </CardContent>
      </Card>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events?.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onVenueChange={handleVenueChange}
          />
        ))}
      </div>
      <AddEventDialog
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        onAddEvent={handleAddEvent}
      />
    </div>
  );
}

// { id: "1", name: "Summer Music Festival", location: "Central Park, New York", date: "2023-07-15", venue: "Outdoor Stage" },
//     { id: "2", name: "Tech Conference 2023", location: "San Francisco, CA", date: "2023-09-22", venue: "Convention Center" },
//     { id: "3", name: "Food & Wine Expo", location: "Paris, France", date: "2023-10-05", venue: "Exhibition Hall" },
