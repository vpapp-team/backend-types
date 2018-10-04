# backend-types

[![Greenkeeper badge](https://badges.greenkeeper.io/vpapp-team/backend-types.svg)](https://greenkeeper.io/)

# TYPEDEFS

| [General](#general) | [Data](#datatypes) |
|:---:|:---:|
| [ClassDiscriminator](#classdiscriminator) | [CalendarEvent](#calendarevent) |
| [LessonDiscriminator](#lessondiscriminator) | [Error](#error) |
| [LessonRange](#lessonrange) | [Feedback](#feedback) |
| [Range](#range) | [LastUpdate](#lastupdate) |
| [Time](#time) | [Lesson](#lesson) |
| [UUID](#uuid) | [Menu](#menu) |
| [Version](#version) | [Room](#room) |
| &#8203; | [Stand-in](#stand-in) |
| &#8203; | [Teacher](#teacher) |
| &#8203; | [Timetable](#timetable) |

# General
> ## ClassDiscriminator
>> extends [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
>> ether a regular format: `/([5-9]|10)[a-d]+|11|12/i`<br>
>> or an exception (e.g.: `DaZ`)
>
> ## LessonDiscriminator
>> extends  [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
>> can be one of two:
>> * regular lesson matching the pattern `/^[0-9]{1,2}(\s*-\s*[0-9]{1,2})?$/`
>> * a break matching the pattern: `/^(([0-9]{1,2}\/)?\/[0-9]{1,2}|[0-9]{1,2}\/)$/`
>
> ## LessonRange
>> extends [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
>>
>> | Parameter | Type | Description | nullable |
>> | --- | --- | --- |:---:|
>> | discriminator | [LessonDiscriminator](#lessondiscriminator) | discriminator | ❌ |
>> | time | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | time in format `HH:MM-HH:MM`<br>or `HH:MM-`<br>or `-HH:MM` | ❌ |
>
> ## Range
>> extends [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
>> can be build 2 ways:
>> * a range consisting of<br>
>> '[Time](#time)-[Time](#time)'<br>
>> one of the Times can be left out to do `until` or `after` e.g.: '-[Time](#time)'
>> * a time and the size of the surrounding<br>
>> both have to be the same type (DateTime or Date)<br>
>> '[Time](#time)+-[Time](#time)'
>>
>> => both work inclusive, means `10-20` matches 10 and 20 and `10+-5` matches 5 and 15
>
> ## Time
>> extends  [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
>> can be two fromats
>> * `/DT[0-9]+/` aka DateTime -> represents the milliseconds passed since 01.01.1970
>> * `/D[0-9]+/` aka Date -> represents the days passed since 01.01.1970
>
> ## UUID
>> extends [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
>> format: `id@issuer`<br>
>> allowed characters: `/[a-z0-9.\-_+]+/` and one `@` in the middle<br>
>> e.g.: ` 12809124@vpapp.de ` or ` 20140807T153702-89251@iserv.nigb.de `
>
> ## Version
>> extends [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)<br>
>> format: `/v(?>[0-9a-f]{1,2}\.){2}[0-9a-f]{1,2}/i`

# Data
> extends [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
> ## CalendarEvent
>> | Field | Type | requirement | Description | nullable |
>> | --- | --- | --- | --- |:---:|
>> | 0 | [UUID](#uuid) | &#8203; | uuid(master's id for recurring events) | ❌ |
>> | 1 | [Time](#time) | &#8203; | start | ❌ |
>> | 2 | [Time](#time) | &#8203; | end | ❌ |
>> | 3 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | &#8203; | summary | ❌ |
>> | 4 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | &#8203; | description | ✔ |
>> | 5 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | &#8203; | location | ✔ |
>> | 6 | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | &#8203; | isRecurring | ❌ |
>> | 7 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | `[isRecurring]==true` | humanRecurrenceRule | ❌ |
>
> ## Error
>> | Field | Type | Description | nullable |
>> | --- | --- | --- |:---:|
>> | 0 | [UUID](#uuid) | errors uuid | ❌ |
>> | 1 | [Time](#time) | time the server received the error | ❌ |
>> | 2 | [Version](#version) | version of the error sending client | ❌ |
>> | 3 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | userAgent of the error sending client | ❌ |
>> | 4 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | platform of the error sending client | ❌ |
>> | 5 | [Time](#time) | time the client caught the error | ❌ |
>> | 6 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | short description of the error | ❌ |
>> | 7 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | stack of the error | ❌ |
>> | 8 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | msg to respond with on the next request | ✔ |
>> | 9 | [Time](#time) | time the msgOnReq was set | ✔ |
>> | 10 | [Time](#time) | time the msgOnReq was send | ✔ |
>
> ## Feedback
>> | Field | Type | Description | nullable |
>> | --- | --- | --- |:---:|
>> | 0 | [UUID](#uuid) | errors uuid | ❌ |
>> | 1 | [Time](#time) | time the server received the error | ❌ |
>> | 2 | [Version](#version) | version of the error sending client | ❌ |
>> | 3 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | userAgent of the error sending client | ❌ |
>> | 4 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | platform of the error sending client | ❌ |
>> | 5 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | the name of the feedback giver | ✔ |
>> | 6 | [UUID](#uuid) | the email of the feedback giver | ✔ |
>> | 7 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | the feedback itself | ❌ |
>> | 8 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | msg to respond with on the next request | ✔ |
>> | 9 | [Time](#time) | time the msgOnReq was set | ✔ |
>> | 10 | [Time](#time) | time the msgOnReq was send | ✔ |
>
> ## LastUpdate
>> | Field | Type | Description | Options | nullable |
>> | --- | --- | --- | --- |:---:|
>> | 0 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | category | `0=timetables`, `1=rooms`, `2=teachers`, `3=menu`, `4=stand-in`, `5=calendar` | ❌ |
>> | 1 | [Time](#time) | last time the category was updated | &#8203; | ❌ |
>
> ## Lesson
>> extends [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
>>
>> | Field | Type | Description | Options | nullable |
>> | --- | --- | --- | --- |:---:|
>> | 0 | [UUID](#uuid) | masters uuid | &#8203; | ❌ |
>> | 1 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | weekday | `0=monday`, `1=tuesday`, `2=wednesday`, `3=thursday`, `4=friday` | ❌ |
>> | 2 | [LessonDiscriminator](#lessondiscriminator) | lesson | &#8203; | ❌ |
>> | 3 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Room | &#8203; | ✔ |
>> | 4 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Teacher | &#8203; | ❌ |
>> | 5 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | Subject | &#8203; | ❌ |
>> | 6 | [ClassDiscriminator](#classdiscriminator) | class name | &#8203; | ❌ |
>> | 7 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Length(e.g.: 2 hour lessons) | &#8203; | ❌ |
>> | 8 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | Regularity | `0=always`, `1=uneven weeks`, `2=even weeks` | ❌ |
>
> ## Menu
>> | Field | Type | Description | nullable |
>> | --- | --- | --- |:---:|
>> | 0 | [UUID](#uuid) | uuid | ❌ |
>> | 1 | [Time](#time) | day | ❌ |
>> | 2 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | default | ❌ |
>> | 3 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | vegetarian | ✔ |
>> | 4 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | desert | ✔ |
>> | 5 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | evening | ✔ |
>
> ## Stand-in
>> | Field | Type | requirement | Description | Options | nullable |
>> | --- | --- |:---:| --- | --- |:---:|
>> | 0 | [UUID](#uuid) | &#8203; | uuid | &#8203; | ❌ |
>> | 1 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | &#8203; | type | `0=default`, `1=motd` | ❌ |
>> | 2 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | `[type]=1=motd` | subtype | `0=other`, `1=absentClasses`, `2=absentTeachers` | ❌ |
>> | 3 | [Time](#time) | &#8203; | day | &#8203; | ❌ |
>> | 4 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | &#8203; | message | &#8203; | ✔ with `[type]=0=default` else ❌ |
>> | 5 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | `[type]=0=default` | teacher | &#8203; | ✔ |
>> | 6 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | `[type]=0=default` | subject | &#8203; | ✔ |
>> | 7 | [LessonDiscriminator](#lessondiscriminator) | `[type]=0=default` | lesson | &#8203; | ✔ |
>> | 8 | [ClassDiscriminator](#classdiscriminator) | `[type]=0=default` | class | &#8203; | ✔ |
>> | 9 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | `[type]=0=default` | room | &#8203; | ✔ |
>> | 10 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | `[type]=0=default` | original teacher | &#8203; | ✔ |
>> | 11 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | `[type]=0=default` | original subject | &#8203; | ✔ |
>> | 12 | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | `[type]=0=default` | is eliminated | &#8203; | ❌ |
>
> ## Teacher
>> | Field | Type | Description | nullable |
>> | --- | --- | --- |:---:|
>> | 0 | [UUID](#uuid) | uuid | ❌ |
>> | 1 | [Boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | leftSchool | ❌ |
>> | 2 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | shorthand | ❌ |
>> | 3 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | name | ❌ |
>> | 4 | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)) | subjects | ❌ |
>> | 5 | [UUID](#uuid) | email | ❌ |
>> | 6 | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)([String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)) | comments | ❌ |
>> | 7 | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)([Timetable](#timetable)) | timetable | ✔ |
>
> ## Timetable
>> extends [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)
>>
>> | Field | Type | requirement | Description | Options | nullable |
>> | --- | --- | :---: | --- | --- |:---:|
>> | 0 | [UUID](#uuid) |  &#8203; | uuid | &#8203; | ❌ |
>> | 1 | [Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number) | &#8203; | type | `0=class`, `1=teacher`, `2=room` | ❌ |
>> | 2 | [ClassDiscriminator](#classdiscriminator) | `[type]=0=class` | class name | &#8203; | ❌ |
>> | 2 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | `[type]=1=teacher` | teachers shorthand | &#8203; | ❌ |
>> | 2 | [String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) | `[type]=2=room` | room name | &#8203; | ❌ |
>> | 3 | [Time](#time) | &#8203; | date this timetable becomes active | &#8203; | ❌ |
>> | 4 | [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)([Lesson](#lesson)) | &#8203; | Content | &#8203; | ❌ |
