import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Event } from "@/app/page";

type EventCardProps = {
  event: Event;
  onVenueChange: (id: string, newVenue: string) => void;
};

export function EventCard({ event, onVenueChange }: EventCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [venueInput, setVenueInput] = useState(event.venue);
  const [permitted, setPermitted] = useState(null);
  const [permittedMessage, setPermittedMessage] = useState(null);
  const [error, setError] = useState("");

  const handleSave = () => {
    onVenueChange(event.id, venueInput);
    setIsEditing(false);
  };

  const checkPermission = async () => {
    try {
      const response = await fetch("http://localhost:4000/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          // return;
          console.log(response);
        }
        const errorText = await response.text();
        throw new Error(
          `Permission check failed with status ${response.status}: ${errorText}`
        );
      }

      const permissionData = await response.json();
      console.log(permissionData.message);
      setPermitted(permissionData !== undefined && permissionData.permitted);
      setPermittedMessage(
        permissionData !== undefined && permissionData.message
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{event.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Location:</strong> {event.location}
        </p>
        <p>
          <strong>Date:</strong> {event.date}
        </p>
        <div className="mt-2">
          <Label htmlFor={`venue-${event.id}`}>Venue:</Label>
          {isEditing ? (
            <Input
              id={`venue-${event.id}`}
              value={venueInput}
              onChange={(e) => setVenueInput(e.target.value)}
              className="mt-1"
              disabled={!permitted}
            />
          ) : (
            <p>{event.venue}</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {isEditing ? (
          <Button onClick={handleSave}>Save</Button>
        ) : (
          <Button
            onClick={() => {
              setIsEditing(true);
              checkPermission();
            }}
          >
            Edit Venue
          </Button>
        )}
        {permittedMessage ? (
          <p className="font-bold text-red-600 ml-8">{permittedMessage}</p>
        ) : null}
      </CardFooter>
    </Card>
  );
}
