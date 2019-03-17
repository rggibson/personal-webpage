function loadXMLDoc( dname ) {
    if (window.XMLHttpRequest) {
	xhttp=new XMLHttpRequest();
    } else {
	xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET", dname, false);
    xhttp.send();
    return xhttp.responseXML;
}

function parseDownload( pub_id, type ) {
    var ext = '-' + type + '.pdf';
    if( type == 'bibtex' ) {
	ext = '_bib.html';
    } else if( type == 'extended technical report' ) {
	ext = '-tr.pdf';
    } else if( type == 'supplementary material' ) {
	ext = '-supp.pdf';
    } else if( type == 'code' ) {
	ext = '-code.zip';
    }
    var is_link = type.indexOf("link") + type.indexOf("YouTube");
    if( is_link == -2 ) {
	/* Not a link or redirect to youtube */
	document.writeln('<a href="static/work/' + pub_id + '/' + pub_id + ext
			 + '" class="btn btn-rgg">' + type + '</a>');
    } else {
	document.writeln( type + ' ' );
    }
}

function parsePersonal( personal_xml ) {
    var xmlDoc = loadXMLDoc( personal_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + personal_xml + '] could not load.');
	return( null );
    }

    var projects = xmlDoc.getElementsByTagName("Project");
    var items = 0;
    for( var i = 0; i < projects.length; i++ ) {
	var project = projects[ i ];
	var item_id = project.getElementsByTagName("ID");
	var project_id = project.getElementsByTagName("Project_ID");
	var title = project.getElementsByTagName("Title");
	var image = project.getElementsByTagName("Image");
	var youtube_id = project.getElementsByTagName("Youtube_ID");
	var details = project.getElementsByTagName("Details");

	if( items % 3 == 0 ) {
	    if( items > 0 ) {
		document.writeln('</div>');
	    }
	    document.writeln('<div class="row">');
	}

	document.writeln('<div class="col-lg-4 col-md-4">');
	document.writeln('<div class="thumbnail thumbnail-rgg">');
	document.writeln('<div class="graphic">');
	if( youtube_id.length > 0 ) {
	    document.writeln('<iframe src="https://www.youtube.com/embed/'
			     + youtube_id[0].childNodes[0].nodeValue
			     + '" frameborder="0" allowfullscreen></iframe>');
	}
	if( image.length > 0 ) {
	    document.writeln('<img src="static/images/'
			     +  image[0].childNodes[0].nodeValue
			     + '" class="img-responsive" alt="'
			     + image[0].childNodes[0].nodeValue + '">');
	}
	document.writeln('</div>');
	document.writeln('<div class="caption">');
	document.writeln('<h3 align="center">' + title[0].childNodes[0].nodeValue
			 + '</h3>');
	document.writeln(details[0].childNodes[0].nodeValue);
	if( project_id.length > 0 ) {
	    /* Related work button */
	    document.writeln('<p><a href="work?t='
			     + project_id[0].childNodes[0].nodeValue
			     + '" class="btn btn-rgg">Related Work</a></p>');
	}
	document.writeln('</div>');
	document.writeln('</div>');
	document.writeln('</div>');

	++items;
    }

    if( personal_xml.indexOf("vids.xml") >= 0 ) {
	/* Little bit of a hack to get an extra column with a twitter feed
	 * for the vids page
	 */
	document.writeln('<div class="col-lg-4 col-md-4" align="center">');
	document.writeln('<a class="twitter-timeline" href="https://twitter.com/rggibson_" data-widget-id="348846377314439168" data-theme="dark" data-link-color="#00C0FF" data-chrome="nofooter noborders transparent" data-tweet-limit="3">Tweets by @rggibson_</a>');
	document.writeln('<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?\'http\':\'https\';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+"://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>');
	document.writeln('</div>');

    }

    document.writeln('</div>');
}

function parsePublications( publications_xml, t ) {
    var xmlDoc = loadXMLDoc( publications_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + publications.xml + '] could not load.');
	return( null );
    }

    var publications = xmlDoc.getElementsByTagName("Publication");
    var cur_area = '';
    var items = 0;
    for( var i = 0; i < publications.length; i++ ) {
	var pub = publications[ i ];
	var project_id = pub.getElementsByTagName("Project_ID");
	if( t != "None" && project_id[0].childNodes[0].nodeValue != t ) {
	    continue;
	}
	var area = pub.getElementsByTagName("Area");
	var pub_id = pub.getElementsByTagName("ID");
	var title = pub.getElementsByTagName("Title");
	var authors = pub.getElementsByTagName("Authors");
	var published = pub.getElementsByTagName("Published");
	var summary = pub.getElementsByTagName("Summary");
	var abs = pub.getElementsByTagName("Abstract");
	var downloads = pub.getElementsByTagName("Download");

	if( t == "None" && area[0].childNodes[0].nodeValue != cur_area ) {
	    /* New publication area.  End row, write heading, start new row */
	    if( items % 3 != 0 ) {
		/* Make sure row hasn't already been ended */
		document.writeln('</div>');
	    }
	    cur_area = area[0].childNodes[0].nodeValue;
	    document.writeln('<h2 align="center">' + cur_area + '</h2>');
	    document.writeln('<div class="row">');
	    items = 0;
	} else if( items % 3 == 0 ) {
	    document.writeln('<div class="row">');
	}

	document.writeln('<div class="col-lg-4 col-md-4">');
	document.writeln('<div class="thumbnail thumbnail-rgg">');
	document.writeln('<div class="caption">');
	document.writeln('<div class="title">'+title[0].childNodes[0].nodeValue+'</div>');
	document.writeln('<div class="authors">' + authors[0].childNodes[0].nodeValue
			 +'</div>');
	document.writeln('<div class="purpose">' + published[0].childNodes[0].nodeValue
			 +'</div>');
	document.writeln('<div class="summary">'+summary[0].childNodes[0].nodeValue+'</div>');
	document.writeln('<div class="downloads"><p>');
	document.writeln('<button type="button" class="btn btn-rgg" data-container="body"'
			 + ' data-toggle="popover" data-placement="auto right" data-content="'
			 + abs[0].childNodes[0].nodeValue + '" data-original-title title>'
			 + 'abstract</button> ');
	for( var j = 0; j < downloads.length; ++j ) {
	    parseDownload( pub_id[0].childNodes[0].nodeValue,
			   downloads[j].childNodes[0].nodeValue );
	}
	document.writeln('</p></div>');
	document.writeln('</div>');
	document.writeln('</div>');
	document.writeln('</div>');

	++items;
	if( items % 3 == 0 ) {
	    document.writeln('</div>');
	}
    }
    if( items % 3 != 0 ) {
	document.writeln('</div>');
    }

    /* Enable popovers */
    $("[data-toggle=popover]").popover()
}

function parsePresentations( presentations_xml, t ) {
    var xmlDoc = loadXMLDoc( presentations_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + presentations.xml + '] could not load.');
	return( null );
    }

    var presentations = xmlDoc.getElementsByTagName("Presentation");
    var items = 0;
    for( var i = 0; i < presentations.length; i++ ) {
	var pres = presentations[ i ];
	var project_id = pres.getElementsByTagName("Project_ID");
	if( t != "None" && project_id[0].childNodes[0].nodeValue != t ) {
	    continue;
	}
	var pres_id = pres.getElementsByTagName("ID");
	var subject = pres.getElementsByTagName("Subject");
	var date = pres.getElementsByTagName("Date");
	var purpose = pres.getElementsByTagName("Purpose");
	var downloads = pres.getElementsByTagName("Download");
	var url = pres.getElementsByTagName("Link");

	if( items % 3 == 0 ) {
	    document.writeln('<div class="row">');
	}

	document.writeln('<div class="col-lg-4 col-md-4">');
	document.writeln('<div class="thumbnail thumbnail-rgg">');
	document.writeln('<div class="caption">');
	document.writeln('<div class="title">' + subject[0].childNodes[0].nodeValue
			 + '</div>');
	document.writeln('<div class="date">' + date[0].childNodes[0].nodeValue
			 +'</div>');
	document.writeln('<div class="purpose">' + purpose[0].childNodes[0].nodeValue
			 + '</div>');
	document.writeln('<div class="downloads"><p>');
	for( var j = 0; j < downloads.length; ++j ) {
	    parseDownload( pres_id[0].childNodes[0].nodeValue,
			   downloads[j].childNodes[0].nodeValue );
	}
  if( url.length > 0 ) {
   document.writeln('<div class="downloads"><p><a href="'
        + url[0].childNodes[0].nodeValue
        + '" class="btn btn-rgg">Link</a></p></div>');
  }
	document.writeln('</p></div>');
	document.writeln('</div>');
	document.writeln('</div>');
	document.writeln('</div>');

	++items;
	if( items % 3 == 0 ) {
	    document.writeln('</div>');
	}
    }
    if( items % 3 != 0 ) {
	document.writeln('</div>');
    }
}

function parseAwards( awards_xml, t ) {
    var xmlDoc = loadXMLDoc( awards_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + awards_xml + '] could not load.');
	return( null );
    }

    var awards = xmlDoc.getElementsByTagName("Award");
    var items = 0;
    for( var i = 0; i < awards.length; i++ ) {
	var award = awards[ i ];
	var project_id = award.getElementsByTagName("Project_ID");
	if( t != "None" && project_id[0].childNodes[0].nodeValue != t ) {
	    continue;
	}
	var name = award.getElementsByTagName("Name");
	var summary = award.getElementsByTagName("Summary");
	var url = award.getElementsByTagName("Link");

	if( items % 3 == 0 ) {
	    document.writeln('<div class="row">');
	}

	document.writeln('<div class="col-lg-4 col-md-4">');
	document.writeln('<div class="thumbnail thumbnail-rgg">');
	document.writeln('<div class="caption">');
	document.writeln('<div class="title">' + name[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="summary">' + summary[0].childNodes[0].nodeValue
			 + '</div>');
	if( url.length > 0 ) {
	    document.writeln('<div class="downloads"><p><a href="'
			     + url[0].childNodes[0].nodeValue
			     + '" class="btn btn-rgg">Link</a></p></div>');
	}
	document.writeln('</div>');
	document.writeln('</div>');
	document.writeln('</div>');

	++items;
	if( items % 3 == 0 ) {
	    document.writeln('</div>');
	}
    }
    if( items % 3 != 0 ) {
	document.writeln('</div>');
    }
}

function parseCourseWork( courseWork_xml, t ) {
    var xmlDoc = loadXMLDoc( courseWork_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + courseWork.xml + '] could not load.');
	return( null );
    }

    var projects = xmlDoc.getElementsByTagName("Project");
    var items = 0;
    for( var i = 0; i < projects.length; i++ ) {
	var project = projects[ i ];
	var project_id = project.getElementsByTagName("Project_ID");
	if( t != "None" && project_id[0].childNodes[0].nodeValue != t ) {
	    continue;
	}
	var work_id = project.getElementsByTagName("ID");
	var title = project.getElementsByTagName("Title");
	var course = project.getElementsByTagName("Course");
	var instructor = project.getElementsByTagName("Instructor");
	var team = project.getElementsByTagName("Team");
	var downloads = project.getElementsByTagName("Download");

	if( items % 3 == 0 ) {
	    document.writeln('<div class="row">');
	}

	document.writeln('<div class="col-lg-4 col-md-4">');
	document.writeln('<div class="thumbnail thumbnail-rgg">');
	document.writeln('<div class="caption">');
	document.writeln('<div class="title">' + title[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="authors">' + team[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="purpose">For ' + course[0].childNodes[0].nodeValue
			 + ' by ' + instructor[0].childNodes[0].nodeValue + '</div>');
	document.writeln('<div class="downloads"><p>');
	for( var j = 0; j < downloads.length; ++j ) {
	    parseDownload( work_id[0].childNodes[0].nodeValue, downloads[j].childNodes[0].nodeValue );
	}
	document.writeln('</p></div>');
	document.writeln('</div>');
	document.writeln('</div>');
	document.writeln('</div>');

	++items;
	if( items % 3 == 0 ) {
	    document.writeln('</div>');
	}
    }
    if( items % 3 != 0 ) {
	document.writeln('</div>');
    }
}

function parseProjects( projects_xml ) {
    var xmlDoc = loadXMLDoc( projects_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + projects_xml + '] could not load.');
	return( null );
    }

    var projects = xmlDoc.getElementsByTagName("Project");
    for( var i = 0; i < projects.length; i++ ) {
	var project = projects[ i ];
	var project_id = project.getElementsByTagName("ID");
	var title = project.getElementsByTagName("Title");
	var image = project.getElementsByTagName("Image");
	var youtube_id = project.getElementsByTagName("Youtube_ID");
	var details = project.getElementsByTagName("Details");

	document.writeln('<div id="' + project_id[0].childNodes[0].nodeValue + '">');
	document.writeln('<h3>' + title[0].childNodes[0].nodeValue + '</h3>');

	document.writeln('<div class="row">');

	document.writeln('<div class="col-lg-4 col-md-4 col-lg-push-8 col-md-push-8">');
	document.writeln('<div class="graphic">');
	if( youtube_id.length > 0 ) {
	    document.writeln('<iframe src="http://www.youtube.com/embed/'
			     + youtube_id[0].childNodes[0].nodeValue
			     + '" frameborder="0" class="img-project"'
			     + ' allowfullscreen></iframe>');
	}
	if( image.length > 0 ) {
	    document.writeln('<img src="static/images/'
			     +  image[0].childNodes[0].nodeValue
			     + '" class="img-responsive img-project" alt="'
			     + image[0].childNodes[0].nodeValue + '">');
	}
	document.writeln('</div>');
	document.writeln('</div>');

	document.writeln('<div class="col-lg-8 col-md-8 col-lg-pull-4 col-md-pull-4">');
	document.writeln(details[0].childNodes[0].nodeValue);
	document.writeln('</div>');

	document.writeln('</div>');
	document.writeln('</div>');
    }
}

function parseBlogs( blogs_xml ) {
    var xmlDoc = loadXMLDoc( blogs_xml );
    if( xmlDoc === null ) {
	document.writeln('Sorry, xml doc [' + blogs_xml + '] could not load.');
	return( null );
    }

    var blogs = xmlDoc.getElementsByTagName("Blog");
    for( var i = 0; i < blogs.length; i++ ) {
	var blog = blogs[ i ];
	var title = blog.getElementsByTagName("Title");
	var date = blog.getElementsByTagName("Date");
	var images = blog.getElementsByTagName("Image");
	var text = blog.getElementsByTagName("Text");

	document.writeln('<h3>' + title[0].childNodes[0].nodeValue + '</h3>');
	document.writeln('<p class="lead">' + date[0].childNodes[0].nodeValue
			 + '</p>');
	document.writeln('<div class="row">');

	document.writeln('<div class="col-lg-4 col-md-4 col-lg-push-8 col-md-push-8">');
	for( var j = 0; j < images.length; j++ ) {
	    document.writeln('<div class="graphic">');
	    document.writeln('<a href="static/images/'
			     + images[j].childNodes[0].nodeValue
			     + '"><img src="static/images/'
			     + images[j].childNodes[0].nodeValue
			     + '" class="img-responsive img-interest" alt="'
			     + images[j].childNodes[0].nodeValue + '"></a>');
	    document.writeln('</div>');
	    if( j < images.length - 1 ) {
		document.writeln('<br>');
	    }
	}
	document.writeln('</div>');

	document.writeln('<div class="col-lg-8 col-md-8 col-lg-pull-4 col-md-pull-4">');
	document.writeln(text[0].childNodes[0].nodeValue);
	document.writeln('</div>');

	document.writeln('</div>');
    }
}
