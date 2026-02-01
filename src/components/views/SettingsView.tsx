import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export function SettingsView() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    commentsOnPosts: true,
    commentsMention: true,
    privateComments: true,
    teacherPosts: true,
    returnedWork: true,
    classInvitations: true,
    dueReminders: true,
  });

  const toggleSetting = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-google-sans text-foreground mb-2">Notifications</h1>
      
      <section className="mt-8">
        <h2 className="text-xl font-google-sans text-foreground mb-2">Email</h2>
        <p className="text-sm text-muted-foreground mb-6">
          These settings apply to the notifications that you receive by email.{" "}
          <a href="#" className="text-primary hover:underline">Learn more</a>
        </p>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Allow email notifications</span>
            <Switch
              checked={settings.emailNotifications}
              onCheckedChange={() => toggleSetting("emailNotifications")}
              className="data-[state=checked]:bg-primary"
            />
          </div>

          <div className="pt-4">
            <h3 className="text-base font-medium text-foreground mb-4">Comments</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Comments on your posts</span>
                <Switch
                  checked={settings.commentsOnPosts}
                  onCheckedChange={() => toggleSetting("commentsOnPosts")}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Comments that mention you</span>
                <Switch
                  checked={settings.commentsMention}
                  onCheckedChange={() => toggleSetting("commentsMention")}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Private comments on work</span>
                <Switch
                  checked={settings.privateComments}
                  onCheckedChange={() => toggleSetting("privateComments")}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <h3 className="text-base font-medium text-foreground mb-4">Classes that you're enrolled in</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Work and other posts from teachers</span>
                <Switch
                  checked={settings.teacherPosts}
                  onCheckedChange={() => toggleSetting("teacherPosts")}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Returned work and marks from your teachers</span>
                <Switch
                  checked={settings.returnedWork}
                  onCheckedChange={() => toggleSetting("returnedWork")}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Invitations to join classes as a student</span>
                <Switch
                  checked={settings.classInvitations}
                  onCheckedChange={() => toggleSetting("classInvitations")}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">Due-date reminders for your work</span>
                <Switch
                  checked={settings.dueReminders}
                  onCheckedChange={() => toggleSetting("dueReminders")}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
