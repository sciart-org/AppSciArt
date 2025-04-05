# AppSciArt - User stories

## System user roles

* **Guest**: Un-authenticated user.
* Authenticated user. They could have (many) different roles:
  * **Participants**: Default role. Even though called "participant", it does not imply that it is participating in some hackathon, but could do it.
  * **Facilitators**: Team staff (administrators). They could be either **Coordinators** or **Assistants**.
  * **Inspiring Scientists**: Creators of SciArt seeds. 
  * **Designer**: Creators of a SciArt methodology (e.g. ASTER+S).
  * **Evaluator**: They evaluate different SciArt flowers.

If the term "user" is used, all roles should be able to perform the user story.

SciArt seeds, flowers and fruits will be referred as just seeds, flowers and fruits.

## User stories

### US-1: Log in

As a guest, I want to log into my already existing account in order to access all the functionalities of AppSciArt.

1. The guest clicks the "Log in" button in the Home screen
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

  0. The participant may get more information by clicking the "What is a hackathon?" button
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

