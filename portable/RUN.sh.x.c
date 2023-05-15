#if 0
	shc Version 3.8.9b, Generic Script Compiler
	Copyright (c) 1994-2015 Francisco Rosales <frosal@fi.upm.es>

	shc -v -r -f RUN.sh 
#endif

static  char data [] = 
#define      tst2_z	19
#define      tst2	((&data[1]))
	"\253\262\147\117\064\020\122\046\001\036\161\017\054\335\237\050"
	"\145\177\127\136\274\320\166\163"
#define      pswd_z	256
#define      pswd	((&data[58]))
	"\260\356\146\052\004\022\223\355\111\036\227\160\137\075\227\204"
	"\273\246\131\035\221\235\030\075\132\351\263\315\365\074\267\246"
	"\053\036\111\361\235\062\346\141\023\342\050\145\377\245\006\301"
	"\236\372\316\012\104\176\125\041\216\260\020\245\054\116\375\162"
	"\174\106\144\031\170\113\172\214\055\243\361\054\110\370\355\347"
	"\363\273\362\067\072\107\131\310\367\151\155\044\270\152\227\064"
	"\261\373\116\051\107\310\266\164\154\247\240\265\240\216\234\223"
	"\112\216\313\204\326\044\115\316\216\272\362\107\045\211\173\326"
	"\205\312\000\314\222\266\100\377\136\341\264\377\157\121\222\272"
	"\340\135\076\266\202\213\204\021\106\166\130\153\000\324\102\205"
	"\236\103\121\061\372\222\060\130\163\345\130\343\066\352\235\026"
	"\110\334\315\313\147\121\334\256\310\065\032\310\012\134\116\250"
	"\240\237\332\232\062\012\363\246\360\113\211\046\065\047\075\176"
	"\003\012\111\153\134\046\032\044\134\064\355\146\220\073\016\060"
	"\333\350\313\015\363\276\263\343\011\075\012\077\145\110\275\151"
	"\123\007\325\257\056\357\323\212\043\301\360\264\374\377\345\327"
	"\350\260\344\334\156\230\277\170\326\312\267\073\022\165\244\145"
	"\175\171\025\253\150\351\066\213\252\047\100\246\046\045\175\017"
	"\325\142\321\057\060\144\034\171\203\263\352\342\361\201\146\254"
	"\047\300\312\271\135\343\367\267\314\252\205\302\347\075\151\022"
	"\133\072\101\214\236\136\006\041\021\360\004\003\161\152\260\231"
	"\052\172\123\210\135\112\100\052\364\306\355\333\003"
#define      xecc_z	15
#define      xecc	((&data[376]))
	"\221\060\353\255\362\340\274\341\263\260\106\233\173\052\116\272"
	"\027\307\060"
#define      chk1_z	22
#define      chk1	((&data[397]))
	"\240\341\126\243\123\333\175\371\014\024\047\053\315\300\303\235"
	"\361\234\111\004\300\124\153\030\013\365\100\300"
#define      inlo_z	3
#define      inlo	((&data[420]))
	"\312\273\366"
#define      text_z	52
#define      text	((&data[426]))
	"\053\212\264\353\113\002\333\104\102\106\152\323\144\150\072\214"
	"\331\066\330\144\262\302\066\233\256\166\234\227\003\373\142\017"
	"\265\163\106\213\354\015\164\250\211\323\325\261\055\305\212\145"
	"\253\364\004\003\250\335\207\125\176\173\103\132\176"
#define      msg2_z	19
#define      msg2	((&data[485]))
	"\052\364\066\061\271\107\222\046\201\104\322\346\363\223\111\237"
	"\326\133\250\015\171\311\133\007"
#define      rlax_z	1
#define      rlax	((&data[508]))
	"\371"
#define      opts_z	1
#define      opts	((&data[509]))
	"\076"
#define      chk2_z	19
#define      chk2	((&data[513]))
	"\335\257\154\300\046\267\300\002\325\354\134\026\073\353\340\273"
	"\250\160\151\035\041\242\035\043\230"
#define      msg1_z	42
#define      msg1	((&data[544]))
	"\046\123\061\201\321\313\312\257\366\236\200\042\244\050\221\120"
	"\061\052\053\163\010\155\031\371\242\247\306\176\356\326\105\004"
	"\374\065\044\312\003\242\174\204\230\270\071\124\235\227\232\154"
	"\051\374\242\104\171\121\113\064\376\363\321\001\076"
#define      date_z	1
#define      date	((&data[596]))
	"\302"
#define      shll_z	10
#define      shll	((&data[598]))
	"\275\047\145\146\311\003\004\123\310\220\336"
#define      lsto_z	1
#define      lsto	((&data[608]))
	"\025"
#define      tst1_z	22
#define      tst1	((&data[613]))
	"\303\002\015\225\215\110\111\033\157\127\206\202\371\346\345\216"
	"\222\253\363\254\366\246\166\150\021\020\315\327\105"/* End of data[] */;
#define      hide_z	4096
#define DEBUGEXEC	0	/* Define as 1 to debug execvp calls */
#define TRACEABLE	0	/* Define as 1 to enable ptrace the executable */

/* rtc.c */

#include <sys/stat.h>
#include <sys/types.h>

#include <errno.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include <unistd.h>

/* 'Alleged RC4' */

static unsigned char stte[256], indx, jndx, kndx;

/*
 * Reset arc4 stte. 
 */
void stte_0(void)
{
	indx = jndx = kndx = 0;
	do {
		stte[indx] = indx;
	} while (++indx);
}

/*
 * Set key. Can be used more than once. 
 */
void key(void * str, int len)
{
	unsigned char tmp, * ptr = (unsigned char *)str;
	while (len > 0) {
		do {
			tmp = stte[indx];
			kndx += tmp;
			kndx += ptr[(int)indx % len];
			stte[indx] = stte[kndx];
			stte[kndx] = tmp;
		} while (++indx);
		ptr += 256;
		len -= 256;
	}
}

/*
 * Crypt data. 
 */
void arc4(void * str, int len)
{
	unsigned char tmp, * ptr = (unsigned char *)str;
	while (len > 0) {
		indx++;
		tmp = stte[indx];
		jndx += tmp;
		stte[indx] = stte[jndx];
		stte[jndx] = tmp;
		tmp += stte[indx];
		*ptr ^= stte[tmp];
		ptr++;
		len--;
	}
}

/* End of ARC4 */

/*
 * Key with file invariants. 
 */
int key_with_file(char * file)
{
	struct stat statf[1];
	struct stat control[1];

	if (stat(file, statf) < 0)
		return -1;

	/* Turn on stable fields */
	memset(control, 0, sizeof(control));
	control->st_ino = statf->st_ino;
	control->st_dev = statf->st_dev;
	control->st_rdev = statf->st_rdev;
	control->st_uid = statf->st_uid;
	control->st_gid = statf->st_gid;
	control->st_size = statf->st_size;
	control->st_mtime = statf->st_mtime;
	control->st_ctime = statf->st_ctime;
	key(control, sizeof(control));
	return 0;
}

#if DEBUGEXEC
void debugexec(char * sh11, int argc, char ** argv)
{
	int i;
	fprintf(stderr, "shll=%s\n", sh11 ? sh11 : "<null>");
	fprintf(stderr, "argc=%d\n", argc);
	if (!argv) {
		fprintf(stderr, "argv=<null>\n");
	} else { 
		for (i = 0; i <= argc ; i++)
			fprintf(stderr, "argv[%d]=%.60s\n", i, argv[i] ? argv[i] : "<null>");
	}
}
#endif /* DEBUGEXEC */

void rmarg(char ** argv, char * arg)
{
	for (; argv && *argv && *argv != arg; argv++);
	for (; argv && *argv; argv++)
		*argv = argv[1];
}

int chkenv(int argc)
{
	char buff[512];
	unsigned long mask, m;
	int l, a, c;
	char * string;
	extern char ** environ;

	mask  = (unsigned long)&chkenv;
	mask ^= (unsigned long)getpid() * ~mask;
	sprintf(buff, "x%lx", mask);
	string = getenv(buff);
#if DEBUGEXEC
	fprintf(stderr, "getenv(%s)=%s\n", buff, string ? string : "<null>");
#endif
	l = strlen(buff);
	if (!string) {
		/* 1st */
		sprintf(&buff[l], "=%lu %d", mask, argc);
		putenv(strdup(buff));
		return 0;
	}
	c = sscanf(string, "%lu %d%c", &m, &a, buff);
	if (c == 2 && m == mask) {
		/* 3rd */
		rmarg(environ, &string[-l - 1]);
		return 1 + (argc - a);
	}
	return -1;
}

#if !defined(TRACEABLE)

#define _LINUX_SOURCE_COMPAT
#include <sys/ptrace.h>
#include <sys/types.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <signal.h>
#include <stdio.h>
#include <unistd.h>

#if !defined(PTRACE_ATTACH) && defined(PT_ATTACH)
#	define PTRACE_ATTACH	PT_ATTACH
#endif
void untraceable(char * argv0)
{
	char proc[80];
	int pid, mine;

	switch(pid = fork()) {
	case  0:
		pid = getppid();
		/* For problematic SunOS ptrace */
#if defined(__FreeBSD__)
		sprintf(proc, "/proc/%d/mem", (int)pid);
#else
		sprintf(proc, "/proc/%d/as",  (int)pid);
#endif
		close(0);
		mine = !open(proc, O_RDWR|O_EXCL);
		if (!mine && errno != EBUSY)
			mine = !ptrace(PTRACE_ATTACH, pid, 0, 0);
		if (mine) {
			kill(pid, SIGCONT);
		} else {
			perror(argv0);
			kill(pid, SIGKILL);
		}
		_exit(mine);
	case -1:
		break;
	default:
		if (pid == waitpid(pid, 0, 0))
			return;
	}
	perror(argv0);
	_exit(1);
}
#endif /* !defined(TRACEABLE) */

char * xsh(int argc, char ** argv)
{
	char * scrpt;
	int ret, i, j;
	char ** varg;
	char * me = argv[0];

	stte_0();
	 key(pswd, pswd_z);
	arc4(msg1, msg1_z);
	arc4(date, date_z);
	if (date[0] && (atoll(date)<time(NULL)))
		return msg1;
	arc4(shll, shll_z);
	arc4(inlo, inlo_z);
	arc4(xecc, xecc_z);
	arc4(lsto, lsto_z);
	arc4(tst1, tst1_z);
	 key(tst1, tst1_z);
	arc4(chk1, chk1_z);
	if ((chk1_z != tst1_z) || memcmp(tst1, chk1, tst1_z))
		return tst1;
	ret = chkenv(argc);
	arc4(msg2, msg2_z);
	if (ret < 0)
		return msg2;
	varg = (char **)calloc(argc + 10, sizeof(char *));
	if (!varg)
		return 0;
	if (ret) {
		arc4(rlax, rlax_z);
		if (!rlax[0] && key_with_file(shll))
			return shll;
		arc4(opts, opts_z);
		arc4(text, text_z);
		arc4(tst2, tst2_z);
		 key(tst2, tst2_z);
		arc4(chk2, chk2_z);
		if ((chk2_z != tst2_z) || memcmp(tst2, chk2, tst2_z))
			return tst2;
		/* Prepend hide_z spaces to script text to hide it. */
		scrpt = malloc(hide_z + text_z);
		if (!scrpt)
			return 0;
		memset(scrpt, (int) ' ', hide_z);
		memcpy(&scrpt[hide_z], text, text_z);
	} else {			/* Reexecute */
		if (*xecc) {
			scrpt = malloc(512);
			if (!scrpt)
				return 0;
			sprintf(scrpt, xecc, me);
		} else {
			scrpt = me;
		}
	}
	j = 0;
	varg[j++] = argv[0];		/* My own name at execution */
	if (ret && *opts)
		varg[j++] = opts;	/* Options on 1st line of code */
	if (*inlo)
		varg[j++] = inlo;	/* Option introducing inline code */
	varg[j++] = scrpt;		/* The script itself */
	if (*lsto)
		varg[j++] = lsto;	/* Option meaning last option */
	i = (ret > 1) ? ret : 0;	/* Args numbering correction */
	while (i < argc)
		varg[j++] = argv[i++];	/* Main run-time arguments */
	varg[j] = 0;			/* NULL terminated array */
#if DEBUGEXEC
	debugexec(shll, j, varg);
#endif
	execvp(shll, varg);
	return shll;
}

int main(int argc, char ** argv)
{
#if DEBUGEXEC
	debugexec("main", argc, argv);
#endif
#if !defined(TRACEABLE)
	untraceable(argv[0]);
#endif
	argv[1] = xsh(argc, argv);
	fprintf(stderr, "%s%s%s: %s\n", argv[0],
		errno ? ": " : "",
		errno ? strerror(errno) : "",
		argv[1] ? argv[1] : "<null>"
	);
	return 1;
}
