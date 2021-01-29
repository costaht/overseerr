# Fail2ban Filter

{% hint style="warning" %}
If you are running Overseerr in a Docker container, make sure that the `PROXY` environment variable is set to `yes`.
{% endhint %}

To use Fail2ban with Overseerr, create a new file named `overseerr.local` in your Fail2ban `filter.d` directory with the following filter definition:

```
[Definition]
failregex = .*\[info\]\[Auth\]\: Failed login attempt.*"ip":"<HOST>"
```

You can then add a jail using this filter in `jail.local`.  Please see the [Fail2ban documetation](https://www.fail2ban.org/wiki/index.php/Manual) for details on how to configure the jail.