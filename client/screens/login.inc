<section>
<p>Select a user account below to sign in:</p>
<nav class ="userlist"><p>No users were returned :( </p> </nav>
</section>

<aside>
<p><em>Obviously</em> you would not run a real server like this, with all user accounts sent to the client before login
(nor would you have an API route to send this information). However, for development and testing, it's fine, and we are 
not expecting secure auth/login for this module.</p>
<p>In production, your server would not directly handle auth anyway, it would be handled by a third party identity provider,
such as Auth0.</p>
</aside>