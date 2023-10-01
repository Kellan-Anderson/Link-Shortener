'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { Copy, CopyCheck, Loader2 } from "lucide-react"
import { toast } from 'react-toastify';
import { addLinkResponseParser } from "~/parsers";
import { generateAlias } from "~/lib/helper/generateAlias";
import { Label } from "~/components/ui/label";

export default function Home() {

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successLink, setSuccessLink] = useState<string | undefined>();
  const aliasPlaceholder = useRef<string>(generateAlias());

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  type formType = {
    link: string,
    alias?: string,
  }
  const { register, handleSubmit, setValue } = useForm<formType>();

  const onSubmitHandler: SubmitHandler<formType> = async (values) => {
    setErrorMessage([]);
    try {
      setLoading(true);

      let url = values.link;
      const http_re = /^(https?:\/\/)/
      if(!http_re.test(url)) {
        url = 'http://' + url;
      }

      const res = await fetch('api/add-link/', {
        method: 'post',
        body: JSON.stringify({
          link: url,
          alias: values.alias || aliasPlaceholder.current
        }),
        cache: "no-cache"
      });
      const message = addLinkResponseParser.parse(await res.json())

      if(res.ok) {
        setSuccessLink(message.message);
      } else {
        setErrorMessage([message.message]);
      }
    } catch (e) {
      setErrorMessage(['There was an error with uploading the link'])
    }
    setLoading(false);
  }

  const onSubmitErrorHandler: SubmitErrorHandler<formType> = (values) => {
    console.log('Form error')
    const errors: string[] = [];
    if(values.alias?.message) errors.push(values.alias.message);
    if(values.link?.message) errors.push(values.link.message);
    setErrorMessage(errors)
  }

  const onGenerateClick = () => {
    const newAlias = generateAlias();
    setValue("alias", newAlias);
  }

  return (
    <Card className="min-w-screen w-96">
      <CardHeader>
        <CardTitle>Make a Link</CardTitle>
      </CardHeader>
      <CardContent>
        <form 
          onSubmit={handleSubmit(onSubmitHandler, onSubmitErrorHandler)}
          className="flex flex-col gap-2.5"
        >
          <Label htmlFor="link">Link</Label>
          <Input
            id="link"
            placeholder="eg. https://www.youtube.com/"
            {...register('link', {
              required: "Please enter a link",
              pattern: {
                value: /^(https?:\/\/)?[^\s/$.?#].[^\s]*$/,
                message: 'Please provide a valid url'
              }
            })}
          />
          <Label htmlFor="alias">Link Alias</Label>
          <div className="w-full flex flex-row gap-1.5">
            <Input
              id="alias"
              placeholder={`eg. ${aliasPlaceholder.current}`}
              {...register('alias', {
                /*
                pattern: {
                  value: /\s/,
                  message: 'Cannot have whitespace in alias'
                }
                */
                // Had to include the validate function due to the above code not working
                validate: value => value?.indexOf(' ') === -1
              })}
            />
            <Button onClick={onGenerateClick} type="button">Generate</Button>
          </div>
          <Button type="submit" className="w-full">
            {loading ? <Loader2 className="animate-spin" /> : "Make a Link"}
          </Button>
          {errorMessage.map(e => <p className="text-red-500 font-semibold text-sm" key={e}>{e}</p>)}
        </form>
      </CardContent>
      {successLink && <SuccessArea newLink={successLink} />}
    </Card>
  )
}

function SuccessArea({ newLink } : { newLink: string }) {
  const [copied, setCopied] = useState(false);
  const [location, setLocation] = useState<string>();

  useEffect(() => {
    const { hostname, port } = window.location;
    const portString = hostname === 'localhost' ? `:${port}` : '';
    setLocation(`http://${hostname}${portString}/${newLink}`)
  }, [])

  const onCopyClick = async () => {
    await navigator.clipboard.writeText(location ?? '');
    setCopied(true);
    toast.success('Copied!', {
      position: "bottom-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }

  return (
    <div className="w-full flex flex-col justify-center items-center gap-1 h-fit py-3">
      <h1>🎉 Success! 🎉</h1>
      <div className="flex flex-row gap-1">
        { copied
          ? <CopyCheck onClick={onCopyClick} className="cursor-pointer" />
          : <Copy onClick={onCopyClick} className="cursor-pointer"/>
        }
        <a href={location}>{location}</a>
      </div>
    </div>
  );
}