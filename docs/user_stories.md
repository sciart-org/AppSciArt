# AppSciArt - User stories

## System user roles

* **Guest**: Un-authenticated user.
* Authenticated user. They could have (many) different roles:
  * **Participants**: Default role. Even though called "participant", it does not imply that it is participating in some hackathon, but could do it.
  * **Facilitators**: Team staff (administrators). They could be either **Coordinators** or **Assistants**.
  * **Inspiring Scientists**: Creators of SciArt seeds. 
  * **Designer**: Creators of a SciArt methodology (e.g. ASTER+S).
  * **Evaluator**: They evaluate different SciArt flowers.

There exists two temporary roles during the hackathon process:
  * **Group voice**: Inside an exploring group, the participant that will be responsible for uploading the conceptual map, and communicating with the facilitators (if necessary)
  * **Speaker**: Inside a co-creation team, the participant that will be responsible for delivering the complete flower, and communicating with the facilitators (if necessary)

If the term "user" is used, all users (authenticated or not) should be able to perform the user story.

SciArt seeds, flowers and fruits will be referred as just seeds, flowers and fruits.

## User stories

### US-1: Log in

As a guest, I want to log into my already existing account in order to access all the functionalities of AppSciArt.

1. Entry point. The guest could click the "Log in" button from:
   * The Home screen
   * Some product collection
   * Some product details 
   * The registration form in [Registering](#us-2-registering)
2. The guest introduces his/her user credentials
3. The user is redirected to the Home screen

### US-2: Registering

As a guest, I want to create an account in order to access all the functionalities of AppSciArt.

This user story has several entry points:

1. Entry point:
     * Direct registration: The guest clicks the "Register" button in the Home screen
     * Quick registration:

        i. The guest introduces his/her email address in the quick registration form in the Home screen

        ii. The guest checks the email received and clicks the "Complete registration" button

     * Unregistered [Joining](#us-3-joining-a-hackathon):

         i. The guest accesses the hackathon list screen

         ii. The guest clicks the "Join hackathon" button of the hackathon he/she wants to join

         iii. The guest fills a quick registration + joining form (minimal information asked)

         iv. The guest is prompted to explore seed collections

         v. The guest checks the email received and clicks the "Complete registration" button
 
2. The guest completes the registration form
3. The participant is prompted to join a hackathon (if not already joined). See [Joining a hackathon](#us-3-joining-a-hackathon)

### US-3: Joining a hackathon

As a participant, I want to be able to join a hackathon, in order to participate in it.

This user story has several possible user workflows:

* From [Registering](#us-2-registering):

  0. The participant may get more information about the methodology format by clicking the "What is a hackathon?" button
  1. If the participant does not want to join:
    
      i. The participant clicks the "Maybe later" button

      ii. The participant is prompted to explore previous editions or get more information about the hackathon format

  2. If the participant wants to join:

      i. The participant clicks the hackathon he/she wants to join

      ii. The participant clicks the "Join this hackathon" button

      iii. The participant fills the joining form

      iv. The participant is prompted to explore seed collections

* From [Unregistered joining](#us-2-registering). 

* From Registered joining:

  1. The participant accesses the hackathon list screen
  2. The guest clicks the "Join hackathon" button of the hackathon he/she wants to join
  3. The participant fills the joining form
  4. The participant is prompted to explore seed collections

* To closest hackathon, from home screen:

  1. The participant clicks the "Join hackathon" button in the Home screen
  2. The participant fills the joining form
  3. The participant is prompted to explore seed collections

* From its seed collection (if there is an incoming hackathon using that collection):

  1. The participant accesses some seed collection
  2. The participant clicks the "Join hackathon" button
  3. The participant fills the joining form
  4. The participant is prompted to explore seed collections

### US-4: Explore SciArt products collections

As a user, I want to explore seed, flower, and fruit collections, in order to discover more about the SciArt process and products.

This user story has several possible user workflows:

1. From Navbar:

     1. The user clicks the "Collections" button in the Navbar
     2. The user selects the product he/she wans to explore (seeds, flowers or fruits)
     3. The user is redirected to the collection screen of the selected product

2. From the carousel of the Home screen (For not finished editions, to seed collections)

    1. The user clicks the logo of the incoming/ongoing edition in the Home screen carousel
    2. The user is redirected to the seed collection of that edition

3. From the edition details screen (For finished editions)

    1. The user accesses the details screen of some edition
    2. The user clicks the product he/she wants to explore (seeds, flowers or fruits)
    3. The user is redirected to the collection screen of the selected product

4. From [Joining a hackathon](#us-3-joining-a-hackathon)

    1. The user clicks the "Seed collection" button shown after joining a hackathon
    2. The user is redirected to the seed collection of the edition of that hackathon

5. From other collections: If the user is on some collection screen, he/she can navigate between seed, flower and fruit collection screens.

By default, the collection of the most recent edition is shown. The user may change the collection by clicking the dropdown in the collection screen.

### US-5: Explore SciArt products details

As a user, I want to explore the details of seed, flower, and fruit collections, in order to discover more about a specific product or topic.

This user story has several possible user workflows:

1. From collections:

    1. The user accesses some product collection
    2. The user clicks the "See more" button of the specific product of which he/she wants to see the details
    3. The user is redirected to the details screen of the selected product

2. From fruit details (To associated seed and flower):

    1. The user accesses the details screen of some fruit
    2. The user clicks the button to see the associated seed or flower
    3. The user is redirected to the details screen of the selected product

3. From the edition details carousel (To fruit details):

    1. The user accesses the details screen of some edition
    2. The user clicks the "Know more" button in the fruits carousel
    3. The user is redirected to the details screen of the selected fruit

4. From [Joining a hackathon](#us-3-joining-a-hackathon) (To seed details)

    1. The user clicks the "Know more" button in the seeds carousel
    2. The user is redirected to the details screen of the selected seed

### US-6: View detailed information about the methodology format

As a user, I want to see the methodology format, in order to understand how it's structured.

This user story has several possible entry points:

1. Entry point:

    * From the "Our format" button in the Navbar
    * From the "Find all the details here" button in the Home screen
    * From [Joining a hackathon - From Registering](#us-3-joining-a-hackathon)

2. The user is redirected to the methodology format details screen after clicking the corresponding button.

### US-7: View the list of incoming hackathons

As a user, I want to see all the incoming hackathons, in order to decide if I will join one or not.

This user story has several possible entry points:

1. Entry point:
   * From the Navbar
   * From [Registering](#us-2-registering)
   * From the [Methodology format](#us-6-view-detailed-information-about-the-methodology-format) screen
2. The user is redirected to the hackathons screen. The list will appear in the "Next hackathons" section.

### US-8: View the hackathons in which I am enrolled

As a participant, I want to see the hackathons in which I am enrolled, in order to organise my schedule so that I can attend.

This user stories has the same user workflow as [US-7](#us-7-view-the-list-of-incoming-hackathons), but the user must be authenticated.

### US-9: View past hackathons in which I participated

As a participant, I want to see past hackathons in which I participated, in order to remember my previous experiences in SciArt.

This user stories has the same user workflow as [US-7](#us-7-view-the-list-of-incoming-hackathons), but the user must be authenticated.

The list will appear in the "Your past hackathons" section.

### US-10: View my creations in a hackathon in which I participated

As a participant, I want to see my creations in a hackathon in which I participated, in order to remember the SciArt process I followed and its results.

1. The participant accesses the "Hackathons" screen
2. The participant clicks the "Your contributions" button in some past hackathon
3. The participant is redirected to the creations screen

